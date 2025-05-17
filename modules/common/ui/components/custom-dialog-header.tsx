"use client"

import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react'

interface Props {
  title?: string;
  subTitle?: string;
  icon?: LucideIcon;

  iconClassNames?: string;
  titleClassNames?: string;
  subtitleClassNames?: string;
}

const CustomDialogHeader = ({icon: Icon, iconClassNames, title, titleClassNames, subTitle, subtitleClassNames}: Props) => {
  return <DialogHeader className='py-6'>
    <DialogTitle asChild>
      <div className="flex flex-col items-center gap-2 mb-2">
        {Icon && <Icon size={30} className={cn("stroke-primary", iconClassNames)}/>}
        {title && <p  className={cn("text-xl text-primary", titleClassNames)}>{title}</p>}
        {subTitle && <p  className={cn("text-sm text-muted-foreground", subtitleClassNames)}>{subTitle}</p>}
      </div>
    </DialogTitle>
    <Separator />
  </DialogHeader>
}

export default CustomDialogHeader
