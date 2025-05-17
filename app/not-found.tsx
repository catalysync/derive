import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-500 mb-4">
          nothing to see here 
        </h1>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href={"/"} className='flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg:primary/80 transition-colors'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
