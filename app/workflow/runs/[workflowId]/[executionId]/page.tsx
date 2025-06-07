import { GetWorkflowExecutionWithPhases } from "@/modules/workflows/server/get-workflow-execution-with-phases";
import TopBar from "@/modules/workflows/ui/components/editor/top-bar";
import ExecutionViewer from "@/modules/workflows/ui/components/execution-viewer";
import { auth } from "@clerk/nextjs/server";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";

const page = ({ params }: { 
  params: {
    executionId: string;
    workflowId: string;
  }
}) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <TopBar
        workflowId={params.workflowId}
        title={"Workflow run details"}
        subtitle={`Run ID: ${params.executionId}`}
        showWorkflowButtons={false}
      />

      <section className="flex h-full overflow-auto">
        <Suspense fallback={
          <div className="flex w-full items-center justify-center">
            <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
          </div>
        }>
          <ExecutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  )
}

async function ExecutionViewerWrapper({
  executionId,
}: { executionId: string; }) {
  const { userId } = await auth();

  if (!userId) {
    return <div>unauthenticated</div>
  }

  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);

  if (!workflowExecution) {
    return <div>Not found</div>;
  }

  return <ExecutionViewer initialData={workflowExecution} />
}

export default page
