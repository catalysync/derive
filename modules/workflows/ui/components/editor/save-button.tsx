import { Button } from '@/components/ui/button'
import { UpdateWorkflow } from '@/modules/workflows/server/update-workflow'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { CheckIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

interface Props {
  workflowId: string
}

const SaveButton = ({workflowId}: Props) => {
  const { toObject } = useReactFlow();

  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Flow saved successfully", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("something went wrong", { id: "save-workflow" })
    }
  })

  return (
    <Button
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject())
        toast.loading("Saving workflow...", { id: "save-workflow" });
        saveMutation.mutate({
          id: workflowId,
          definition: workflowDefinition
        })
      }}
    >
      <CheckIcon size={16} className='stroke-primary'/>
      Save
    </Button>
  )
}

export default SaveButton
