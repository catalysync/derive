import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/modules/common/ui/components/theme-toggle';
import BreadcrumbHeader from '@/modules/home/ui/breadcrumb-header';
import DesktopSidebar from '@/modules/home/ui/sidebar';
import { SignedIn, UserButton } from '@clerk/nextjs';
import React from 'react'

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-screen'>
      <DesktopSidebar />
      <div className='flex flex-col flex-1 min-h-screen'>
        <header className='flex items-center justify-between px-6 py-4 h-[50px] container'>
          dérive
          <BreadcrumbHeader />
          <div className="gap-1 flex items-center">
            <ThemeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
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
