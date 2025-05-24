"use client"

import { Workflow } from "@/app/generated/prisma";
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, Node, ReactFlow, useEdgesState, useNodesState, useReactFlow} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "../tasks/create-flow-node";
import { TaskType } from "@/modules/common/types/task";
import NodeComponent from "../workflow/node";
import { DragEvent, useCallback, useEffect } from "react";
import { AppNode } from "@/modules/common/types/app-node";
import { TaskRegistry } from "../tasks/registry";
import DeletableEdge from "../workflow/node-card/deletable-edge";

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
  const {setViewport, screenToFlowPosition, updateNodeData} = useReactFlow();

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
    setEdges(edges => addEdge({ ...connection, animated: true}, edges));

    if (!connection.targetHandle) return;

    // Remove input value if is present on connection
    const node = nodes.find((nd) => nd.id === connection.target);
    if (!node) return;
    const nodeInputs = node.data.inputs;
    delete nodeInputs[connection.targetHandle];
    updateNodeData(node.id, {
      inputs: {nodeInputs}
    })
  }, [nodes, setEdges, updateNodeData]);

  const isValidConnection = useCallback((connection: Edge | Connection) => {
    // Connection Scenarios

    // No self-connections allowed
    if (connection.source === connection.target) {
      return false;
    }

    //only allow input-output connections of same type
    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);

    if (!sourceNode || !targetNode) return false;

    const sourceTask = TaskRegistry[sourceNode.data.type];
    const targetTask = TaskRegistry[targetNode.data.type];

    const sourceOutput = sourceTask.outputs.find((o) => o.name === connection.sourceHandle);
    const targetInput =  targetTask.inputs.find((o) => o.name === connection.targetHandle);

    if (sourceOutput?.type !== targetInput?.type) return false;
    
    // Prevent cycles
    const hasCycle = (node: Node, visited = new Set()) => {
      if (visited.has(node.id)) return false;

      visited.add(node.id);

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true;
        if (hasCycle(outgoer, visited)) return true;
      }
    };
    
    return !hasCycle(targetNode);
  }, [edges, nodes]);

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
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;