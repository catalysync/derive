import { Node } from "@xyflow/react";
import { TaskType } from "./task";


export interface AppNodeData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  type: TaskType;
  inputs: Record<string, string>;
}

export interface AppNode extends Node {
  data: AppNodeData
}

export type AppNodeMissingInputs = {
  nodeId: string;
  inputs: string[];
}