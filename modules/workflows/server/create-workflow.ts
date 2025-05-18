"use server";

import { prisma } from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "../schema/workflows";
import { auth } from "@clerk/nextjs/server";
import { WorkflowStatus } from "@/modules/common/types/workflow";
import { redirect } from "next/navigation";

export async function CreateWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  
  if (!success) {
    throw new Error("invalid workflow data");
  }

  const { userId } = await auth();

  if(!userId) {
    throw new Error("unauthenticated");
  }
  
  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: "TODO",
      ...data,
    },
  })

  if (!result) {
    throw new Error("failed to create workflow")
  }

  redirect(`/workflow/editor/${result.id}`);
}