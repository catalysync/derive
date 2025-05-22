import { Button } from "@/components/ui/button"
import TooltipWrapper from "@/modules/common/ui/components/tooltip-wrapper"
import { ChevronLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import SaveButton from "./save-button";

interface Props {
  title: string;
  subtitle?: string;
  workflowId: string;
}

const TopBar = ({title, subtitle, workflowId}: Props) => {
  const router = useRouter();

  return (
    <header className="flex p-2 border-b-2 
    border-separate justify-between w-full sticky top-0 bg-background z-10 h-[60px]">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">
            {title}
          </p>
          {
            subtitle && (
              <p className="text-xs text-muted-foreground trunncate text-ellipsis">
                {subtitle}
              </p>
            )
          }
        </div>
      </div>

      <div className="flex gap-1 flex-1 justify-end">
        <SaveButton workflowId={workflowId} />
      </div>
    </header>
  )
}

export default TopBar
