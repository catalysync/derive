import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/modules/common/ui/components/theme-toggle'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col w-full h-screen'>
      {children}
      <Separator />
      <footer className="flex items-center justify-between p-2">
        <ThemeToggle />
      </footer>
    </div>
  )
}

export default layout
