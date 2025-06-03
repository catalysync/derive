import { Button } from '@/components/ui/button'
import { PlayIcon } from 'lucide-react'
import useExecutionPlan from '../../tasks/useExecutionPlan'
import { useMutation } from '@tanstack/react-query'
import { RunWorkflow } from '@/modules/workflows/server/run-workflow'
import { toast } from 'sonner'
import { useReactFlow } from '@xyflow/react'

interface Props {
  workflowId: string
}

const ExecuteButton = ({ workflowId }: Props) => {
  const generate = useExecutionPlan();

  const { toObject } = useReactFlow();

  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Execution started", { id: "flow-execution" });
    },
    onError: () => {
      toast.error("Workflow Execution Failed", { id: "flow-execution" });
    },
  })
  return (
    <Button
      disabled={mutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate();
        if(!plan) {
          return;
        }

        mutation.mutate({
          workflowId: workflowId,
          flowDefinition: JSON.stringify(toObject())
        })
      }}
    >
      <PlayIcon size={16} className='stroke-orange-400'/>
      Execute
    </Button>
  )
}

export default ExecuteButton
