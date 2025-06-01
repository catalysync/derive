import { Button } from '@/components/ui/button'
import { UpdateWorkflow } from '@/modules/workflows/server/update-workflow'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { PlayIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import useExecutionPlan from '../../tasks/useExecutionPlan'

interface Props {
  workflowId: string
}

const ExecuteButton = ({workflowId}: Props) => {
  const generate = useExecutionPlan();

  return (
    <Button
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate();
      }}
    >
      <PlayIcon size={16} className='stroke-orange-400'/>
      Execute
    </Button>
  )
}

export default ExecuteButton
