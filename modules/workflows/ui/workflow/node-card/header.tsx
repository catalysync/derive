import { TaskType } from '@/modules/common/types/task'
import React from 'react'
import { TaskRegistry } from '../../tasks/registry'
import { Badge } from '@/components/ui/badge'
import { CoinsIcon, GripVerticalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  taskType: TaskType
}

const NodeCardHeader = ({ taskType }: Props) => {
  const task = TaskRegistry[taskType]

  return (
    <div className='flex items-center gap-2 p-2'>
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge>Entrypoint</Badge>}
          <Badge className='gap-2 flex items-center text-xs'>
            <CoinsIcon size={16} />
            20
          </Badge>
          <Button variant={"ghost"} size={"icon"} className="drag=handle cursor-grab">
            <GripVerticalIcon size={20} />
          </Button>
        </div>    
      </div>
    </div>
  )
}

export default NodeCardHeader
