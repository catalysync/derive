import { TaskParamType, TaskType } from "@/modules/common/types/task";
import { LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract text from element",
  icon: (props: LucideProps) => <TextIcon className="stroke-rose-400" {...props} />,
  isEntryPoint: true,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    }
  ],
  outputs: [
    {
      name: "Extracted text",
      type: TaskParamType.STRING
    },
  ]
}