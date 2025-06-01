import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { FlowToExecutionPlan, FlowToExecutionPlanErrorType, FlowToExecutionPlanValidationError } from "./execution-plan";
import { AppNode } from "@/modules/common/types/app-node";
import useFlowValidation from "../workflow/useFlowValidation";
import { toast } from "sonner";

const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  const handleError = useCallback((error: FlowToExecutionPlanErrorType) => {
    switch (error.type) {
      case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
        toast.error("No entrypoint found")
        break;
      case FlowToExecutionPlanValidationError.INVALID_INPUTS:
        setInvalidInputs(error.invalidElements!);
        toast.error("Not all input values are set")
        break;
      default:
        break;
    }
  }, [setInvalidInputs])

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(nodes as AppNode[], edges);

    if (error) {
      handleError(error)
      return null;
    }

    clearErrors();
    
    return executionPlan;
  }, [clearErrors, handleError, toObject]);

  return generateExecutionPlan;
}

export default useExecutionPlan;