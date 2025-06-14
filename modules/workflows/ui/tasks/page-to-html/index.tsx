import { TaskParamType, TaskType } from "@/modules/common/types/task";
import { WorkflowTask } from "@/modules/common/types/workflow";
import { CodeIcon, LucideProps } from "lucide-react";

export const PageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get html from page",
  icon: (props: LucideProps) => <CodeIcon className="stroke-rose-400" {...props} />,
  isEntryPoint: true,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    }
  ] as const,
  outputs: [
    {
      name: "Html",
      type: TaskParamType.STRING
    },
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE
    }
  ] as const,
  credits: 2
}  satisfies WorkflowTask;