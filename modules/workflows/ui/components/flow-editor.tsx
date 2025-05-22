"use client"

import { Workflow } from "@/app/generated/prisma";
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "../tasks/create-flow-node";
import { TaskType } from "@/modules/common/types/task";
import NodeComponent from "../workflow/node";
import { useEffect } from "react";

interface Props {
  workflow: Workflow
}

const nodeTypes = {
  Node: NodeComponent
}

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const {setViewport} = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);

      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      // if(!flow.viewport) return;
      // const { x = 0,  y = 0, zoom = 1} = flow.viewport;
      // setViewport({ x, y, zoom });
    } catch (error) {}
  }, [setEdges, setNodes, setViewport, workflow.definition])

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        fitView
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;