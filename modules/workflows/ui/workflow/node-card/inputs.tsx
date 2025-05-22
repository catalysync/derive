import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { TaskParam, TaskParamType } from '@/modules/common/types/task';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import React, { useCallback } from 'react'
import StringInput from './string-input';
import { AppNode } from '@/modules/common/types/app-node';

interface Props {
  children: React.ReactNode;
}

const NodeCardInputs = ({children}: Props) => {
  return (
    <div className='flex flex-col divide-y gap-2'>
      {children}
    </div>
  )
}

export const NodeInput = ({input, nodeId}: { input: TaskParam, nodeId: string }) => {
  return <div className='flex justify-start relative p-3 bg-secondary w-full'>
    <NodeInputField input={input} nodeId={nodeId} />
    {!input.hideHandle && (<Handle 
      id={input.name}
      type='target'
      position={Position.Left}
      className={cn("!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4")}
    />)}
  </div>
}


const NodeInputField = ({input, nodeId}: { input: TaskParam, nodeId: string }) => {
  const {updateNodeData, getNode} = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value =  node?.data.inputs?.[input.name]

  const updateNodeInputValue = useCallback((newValue: string) => {
    updateNodeData(nodeId, {
      inputs: {
        ...node?.data.inputs,
        [input.name]: newValue
      }
    })
  }, [updateNodeData, nodeId, node?.data.inputs, input.name]);

  switch (input.type) {
    case TaskParamType.STRING:
      return <StringInput input={input} value={value} updateNodeInputValue={updateNodeInputValue}/>
    default:
      return <div className="w-full">
        <p className="text-xs text-muted-foreground">
          not implemented
        </p>
      </div>;
  }
}

export default NodeCardInputs
