import { prisma } from '@/lib/prisma';
import Editor from '@/modules/workflows/ui/components/editor';
import { auth } from '@clerk/nextjs/server';
import React from 'react'

const page = async ({params}: {params: {workflowId: string}}) => {
  const { workflowId } = params;
  const {userId} = await auth();

  if (!userId) return <div>unauthenticated</div>;

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  })

  if (!workflow) return <div>Workflow not found</div>

  return (
    <Editor workflow={workflow} />
  )
}

export default page
