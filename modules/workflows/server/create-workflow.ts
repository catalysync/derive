"use server";

import { prisma } from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "../schema/workflows";
import { auth } from "@clerk/nextjs/server";
import { WorkflowStatus } from "@/modules/common/types/workflow";
import { redirect } from "next/navigation";
import { AppNode } from "@/modules/common/types/app-node";
import { Edge } from "@xyflow/react";
import { CreateFlowNode } from "../ui/tasks/create-flow-node";
import { TaskType } from "@/modules/common/types/task";

export async function CreateWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  
  if (!success) {
    throw new Error("invalid workflow data");
  }

  const { userId } = await auth();

  if(!userId) {
    throw new Error("unauthenticated");
  }
  
  const initialDefinition: { nodes: AppNode[], edges: Edge[] } = {
    nodes: [
      // FLOW ENTRYPOINT
      CreateFlowNode(TaskType.LAUNCH_BROWSER)
    ],
    edges: [],
  }
  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialDefinition),
      ...data,
    },
  })

  if (!result) {
    throw new Error("failed to create workflow")
  }

  redirect(`/workflow/editor/${result.id}`);
}