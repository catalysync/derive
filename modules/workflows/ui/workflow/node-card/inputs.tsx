import { cn } from '@/lib/utils';
import { ColorForHandle, TaskParam, TaskParamType } from '@/modules/common/types/task';
import { Handle, Position, useEdges, useReactFlow } from '@xyflow/react';
import React, { useCallback } from 'react'
import StringInput from './string-input';
import { AppNode } from '@/modules/common/types/app-node';
import BrowserInstanceInput from './browser-instance-input';
import useFlowValidation from '../useFlowValidation';

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
  const edges = useEdges();

  const { invalidInputs } = useFlowValidation();
  const hasErrors = invalidInputs.find(node => node.nodeId === nodeId)?.inputs.find(
    (invalidInput) => invalidInput === input.name
  );

  const isConnected = edges.some(edge => edge.target === nodeId && edge.targetHandle === input.name)
  return <div className={cn(
      'flex justify-start relative p-3 bg-secondary w-full',
      hasErrors && 'bg-destructive/30'
    )}>
    <NodeInputField input={input} nodeId={nodeId} disabled={isConnected} />
    {!input.hideHandle && (<Handle 
      id={input.name}
      isConnectable={!isConnected}
      type='target'
      position={Position.Left}
      className={cn(
        "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
        ColorForHandle[input.type]
      )}
    />)}
  </div>
}


const NodeInputField = ({input, nodeId, disabled}: { input: TaskParam, nodeId: string, disabled: boolean }) => {
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
      return <StringInput
      input={input}
      value={value}
      disabled={disabled}
      updateNodeInputValue={updateNodeInputValue}/>
    case TaskParamType.BROWSER_INSTANCE:
      return <BrowserInstanceInput input={input} value={""} updateNodeInputValue={updateNodeInputValue}/>
    default:
      return <div className="w-full">
        <p className="text-xs text-muted-foreground">
          not implemented
        </p>
      </div>;
  }
}

export default NodeCardInputs
