import "server-only"
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/modules/common/types/workflow";
import { TaskRegistry } from "@/modules/workflows/ui/tasks/registry";
import { AppNode } from "@/modules/common/types/app-node";
import { ExecutorRegistry } from "@/modules/workflows/server/executor/registry";
import { Environment, ExecutionEnvironment } from "@/modules/common/types/executor";
import { WorkflowTask } from '../../modules/common/types/workflow';
import { TaskParamType } from "@/modules/common/types/task";
import { Browser, Page } from "puppeteer";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId
    },
    include: {
      workflow: true, phases: true,
    }
  });

  if (!execution) {
    throw new Error("execution not found");
  }

  const environment = { phases: {} };

  await initializeWorkflowExecution(executionId, execution.workflowId);
  await initializePhaseStatuses(execution);

  let executionFailed = false;
  let creditsConsumed = 0;

  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(phase, environment);
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed);

  await cleanupEnvironment(environment);

  revalidatePath("/workflows/runs");
}

async function initializeWorkflowExecution(executionId: string, workflowId: string) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    }
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    }
  })
}

async function initializePhaseStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id)
      }
    },
    data: {
      status: ExecutionPhaseStatus.PENDING
    }
  })
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ?  WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where:  { id: executionId },
    data:  {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed
    }
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
      lastRunId: executionId
    },
    data: {
      lastRunStatus: finalStatus
    }
  }).catch((err: Error) => {
    // Ignore
    // this means we triggered other runs for this workflow while an execution was running
  })
}

async function executeWorkflowPhase(phase: ExecutionPhase, environment: Environment) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  setupEnvironmentForPhase(node, environment);

  //  Update phase status
  await prisma.executionPhase.update({
    where: {
      id: phase.id
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs)
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;
  console.log(`Executing phase ${phase.name} with ${creditsRequired} credits required`)

  // Decrement user balance with required credits
  const success = await executePhase(phase, node, environment);

  const outputs = environment.phases[node.id].outputs;

  await finalizePhase(phase.id, success, outputs);
  return { success };
}

async function finalizePhase(phaseId: string, success: boolean, outputs: any) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
    }
  })
}

async function executePhase(phase: ExecutionPhaseStatus, node: AppNode, environment: Environment): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];

  if (!runFn) {
    return false;
  }

  const executionEnvironment: ExecutionEnvironment<WorkflowTask> = createExecutionEnvironment(node, environment)

  return await runFn(executionEnvironment);
}

function setupEnvironmentForPhase(node: AppNode, environment: Environment) {
  environment.phases[node.id] = { inputs: {}, outputs: {} };
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) {
      continue;
    }

    const inputValue = node.data.inputs[input.name];

    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    // Get input value from outputs in the environment
    
  }
}

function createExecutionEnvironment(node: AppNode, environment: Environment): ExecutionEnvironment<WorkflowTask> {
  return {
    getInput: (name:string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value;
    },

    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => environment.browser = browser,

    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page)
  }
}

async function cleanupEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser.close().catch(err => console.error("cannot close browser, reason:", err))
  }
}