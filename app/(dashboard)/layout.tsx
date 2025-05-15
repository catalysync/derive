import { Separator } from '@/components/ui/separator';
import BreadcrumbHeader from '@/modules/home/ui/breadcrumb-header';
import DesktopSidebar from '@/modules/home/ui/sidebar';
import React from 'react'

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-screen'>
      <DesktopSidebar />
      <div className='flex flex-col flex-3 min-h-screen'>
        <header className='flex items-center justify-between px-6 py-4 h-[50px] container'>
          dérive
          <BreadcrumbHeader />
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="flex-1 container py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default layout
