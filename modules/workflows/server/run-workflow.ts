"use server";

import { prisma } from "@/lib/prisma";
import { ExecutionPhaseStatus, WorkflowExecutionStatus, WorkflowExecutionTrigger } from "@/modules/common/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { FlowToExecutionPlan } from "../ui/tasks/execution-plan";
import { TaskRegistry } from "../ui/tasks/registry";
import { redirect } from "next/navigation";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";

export async function RunWorkflow(form: {
  workflowId: string,
  flowDefinition?: string,
}) {
  const { userId } = await auth();

  if(!userId) {
    throw new Error("unauthenticated");
  }

  const { workflowId, flowDefinition } = form;

  if (!workflowId) {
    throw new Error("workflowId is required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("workflow not found");
  }

  if (!flowDefinition) {
    throw new Error("flow definition is required");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    throw new Error(`Flow definition not valid: ${result.error.type}`);
  }

  if (!result.executionPlan) {
    throw new Error("No execution plan generated");
  }


  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      phases: {
        create: result.executionPlan.flatMap(phase => phase.nodes.flatMap((node) => {
          return {
            userId,
            status: ExecutionPhaseStatus.CREATED,
            number: phase.phase,
            node: JSON.stringify(node),
            name: TaskRegistry[node.data.type].label
          }
        }))
      },
      select: {
        id: true,
        phases: true,
      }
    }
  });

  if (!execution) {
    throw new Error("Workflow execution not created")
  }

  ExecuteWorkflow(execution.id); // Run this in background

  redirect(`/workflow/runs/${workflowId}/${execution.id}`)
}