import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { SkeletonDP } from './components/SkeletonDP'
import { SkeletonContainer } from './components/SkeletonContainer'
import { SkeletonMessage } from './components/SkeletonMessage'


export default function Loading () {
  return (
    <div className='lg:pl-80 h-screen'>
        <div className='px-6 w-full h-full'>
            <div className='flex gap-4 items-center border-b-2 py-4'>
                <SkeletonDP size='w-8 h-8 sm:w-10 sm:h-10' />
                <div className='flex flex-col items-center gap-3'>
                    <SkeletonContainer size='w-36 h-6 sm:w-48 sm:h-8' />
                    <SkeletonContainer size='w-24 h-3 sm:w-32 sm:h-4' />
                </div>
            </div>

            <div className='mt-12 w-full h-full flex flex-col justify-around'>
                <SkeletonMessage className='justify-end' order='order-2' />
                <SkeletonMessage className='justify-start' />
                <SkeletonMessage className='justify-end' order='order-2' />
                <SkeletonMessage className='justify-start ' />
            </div>
        </div>
    </div>
  )
}
