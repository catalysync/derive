import { cn } from '@/lib/utils';
import { ColorForHandle, TaskParam } from '@/modules/common/types/task';
import { Handle, Position } from '@xyflow/react';

interface Props {
  children: React.ReactNode;
}

const NodeCardOutputs = ({children}: Props) => {
  return (
    <div className='flex flex-col divide-y gap-1'>
      {children}
    </div>
  )
}

export const NodeOutput = ({output}: { output: TaskParam }) => {
  return <div className='flex justify-end relative p-3 bg-secondary w-full'>
    <Handle 
      id={output.name}
      type='source'
      position={Position.Right}
      className={cn(
        "!bg-muted-foreground !border-2 !border-background !-right-2 !w-4 !h-4",
        ColorForHandle[output.type]
      )}
    />
  </div>
}

export default NodeCardOutputs
