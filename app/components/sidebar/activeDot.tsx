import clsx from 'clsx'
import React from 'react'


interface ActiveDotProps {
    size : string
}
export const ActiveDot: React.FC<ActiveDotProps> = ({ size }) => {
  return (
    <span 
        className={clsx(`
        z-50
        absolute 
        block 
        rounded-full 
        bg-green-500 
        ring-2 
        ring-white 
        top-0 
        right-0
        `, size)}
    />
  )
}
