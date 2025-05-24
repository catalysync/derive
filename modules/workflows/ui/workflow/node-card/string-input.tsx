import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { TaskParam } from "@/modules/common/types/task";
import { useEffect, useId, useState } from "react";

interface Props {
  input: TaskParam;
  value: string;
  disabled: boolean;
  updateNodeInputValue: (newValue: string) => void;
}
const StringInput = ({input, value, disabled, updateNodeInputValue}: Props) => {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  let Component: any = Input;

  if (input.variant === "textarea") {
    Component = Textarea
  }

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {input.name}
        {input.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Component id={id} value={internalValue} placeholder="Enter value here"
        className="text-xs" 
        disabled={disabled}
        onChange={e => setInternalValue(e.target.value)}
        onBlur={e => updateNodeInputValue(e.target.value)} />
      {input.helperText && (
        <p className="text-muted-foreground px-2">{input.helperText}</p>
      )}
    </div>
  )
}

export default StringInput
