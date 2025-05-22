"use server";

import { prisma } from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "../schema/workflows";
import { auth } from "@clerk/nextjs/server";
import { WorkflowStatus } from "@/modules/common/types/workflow";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface UpdateWorkflowSchema {
  id: string;
  definition: string;
}

export async function UpdateWorkflow({
  id, definition
}: UpdateWorkflowSchema) {
  const { userId } = await auth();

  if(!userId) {
    throw new Error("unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id, userId,
    },
  });

  if (!workflow) throw new Error("workflow not found");
  if (workflow.status !== WorkflowStatus.DRAFT) throw new Error("workflow is published");
  
  await prisma.workflow.update({
    data: {
      definition 
    },
    where: {
      id,
      userId
    }
  });

  revalidatePath("/workflows");
}