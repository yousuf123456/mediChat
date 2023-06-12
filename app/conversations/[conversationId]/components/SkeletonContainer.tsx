import { Skeleton } from '@/components/ui/skeleton'
import clsx from 'clsx'
import React from 'react'

interface SkeletonContainerProps {
    size : string
}

export const SkeletonContainer: React.FC<SkeletonContainerProps> = ({ size }) => {
  return (
    <Skeleton className={clsx("bg-blue-200", size)}/>
  )
}
