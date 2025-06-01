import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { FlowToExecutionPlan } from "./execution-plan";
import { AppNode } from "@/modules/common/types/app-node";

const useExecutionPlan = () => {
  const { toObject } = useReactFlow();

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan } = FlowToExecutionPlan(nodes as AppNode[], edges);
    return executionPlan;
  }, [toObject]);

  return generateExecutionPlan;
}

export default useExecutionPlan;