import React from 'react'
import { SkeletonDP } from './SkeletonDP'
import { SkeletonContainer } from './SkeletonContainer'
import clsx from 'clsx'

interface SkeletonMessageProps {
    className : string,
    order? : string
}

export const SkeletonMessage: React.FC<SkeletonMessageProps> = ( { className, order } ) => {
  return (
    <div className={clsx('flex gap-4 w-full items-center', className)}>
        <SkeletonDP size={clsx('w-10 h-10 ', order)} />
        <div className='flex flex-col gap-2 w-5/6 sm:w-1/2'>
            <div className='w-full flex justify-between'>
                <SkeletonContainer size='w-1/3 lg:w-1/6 h-2 sm:h-3'/>
                <SkeletonContainer size='w-1/3 lg:w-1/6 h-2 sm:h-3'/>
            </div>

            <div>
                <SkeletonContainer size='w-5/6 sm:w-full h-12 sm:h-16'/>
            </div>

            <div>
                <SkeletonContainer size='w-10 h-2 sm:w-14 sm:h-3'/>
            </div>
        </div>
    </div>
  )
}
