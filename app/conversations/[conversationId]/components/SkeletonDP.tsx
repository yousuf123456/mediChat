import { Skeleton } from '@/components/ui/skeleton'
import clsx from 'clsx'
import React from 'react'

interface SkeletonDPProps {
    size : string
}

export const SkeletonDP: React.FC<SkeletonDPProps> = ({ size }) => {
  return (
    <Skeleton className={clsx("bg-blue-200 rounded-full", size)}/>
  )
}
