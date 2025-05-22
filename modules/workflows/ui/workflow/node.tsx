import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./node-card";
import { AppNodeData } from "@/modules/common/types/app-node";
import NodeCardHeader from "./node-card-header";

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData
  return <NodeCard nodeId={props.id} isSelected={!!props.selected}>
    <NodeCardHeader taskType={nodeData.type} />
  </NodeCard>
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent"