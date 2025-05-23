"use client"

import { Workflow } from "@/app/generated/prisma";
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, ReactFlow, useEdgesState, useNodesState, useReactFlow} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "../tasks/create-flow-node";
import { TaskType } from "@/modules/common/types/task";
import NodeComponent from "../workflow/node";
import { DragEvent, useCallback, useEffect } from "react";
import { AppNode } from "@/modules/common/types/app-node";

interface Props {
  workflow: Workflow
}

const nodeTypes = {
  Node: NodeComponent
}

const edgeTypes = {
  default: DeletableEdge,
}

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const {setViewport, screenToFlowPosition} = useReactFlow();

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

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move"
  }, []);

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    const taskType = event.dataTransfer.getData("application/reactflow");
    if (typeof taskType === undefined || !taskType) return;

     const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
     })

    const newNode = CreateFlowNode(taskType as TaskType, position)
    setNodes((nodes) => nodes.concat(newNode))
  }, [screenToFlowPosition, setNodes]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges(edges => addEdge({ ...connection, animated: true}, edges))
  }, [setEdges])

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;