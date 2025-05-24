import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./node-card";
import { AppNodeData } from "@/modules/common/types/app-node";
import { TaskRegistry } from "../tasks/registry";
import NodeCardHeader from "./node-card/header";
import NodeCardInputs, { NodeInput } from "./node-card/inputs";
import NodeCardOutputs, { NodeOutput } from "./node-card/outputs";

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData
  const task = TaskRegistry[nodeData.type];

  return <NodeCard nodeId={props.id} isSelected={!!props.selected}>
    <NodeCardHeader taskType={nodeData.type} nodeId={props.id} />
    <NodeCardInputs>
      {
        task.inputs.map((input) => {
          return <NodeInput key={input.type} input={input} nodeId={props.id}/>
        })
      }
    </NodeCardInputs>
    <NodeCardOutputs>
      {
        task.outputs.map((output) => {
          return <NodeOutput key={output.type} output={output} />
        })
      }
    </NodeCardOutputs>
  </NodeCard>
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent"