"use client"

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import TooltipWrapper from '@/modules/common/ui/components/tooltip-wrapper'
import { MoreVerticalIcon, TrashIcon } from 'lucide-react'
import React, { useState } from 'react'
import DeleteWorkflowDialog from '../delete-workflow-dialog'

interface Props {
  workflowName: string;
  workflowId: string;
}

const WorkflowActions = ({ workflowName, workflowId }: Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);


  return (
    <>
      <DeleteWorkflowDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} workflowName={workflowName} workflowId={workflowId} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"sm"}>
            <TooltipWrapper content={"More actions"}>
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem className='text-destructive flex items-center gap-2' onSelect={() => {
            setShowDeleteDialog((prev) => !prev);
          }}>
            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>

  )
}

export default WorkflowActions
