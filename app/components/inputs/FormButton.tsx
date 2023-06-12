import clsx from 'clsx'
import React, { ReactNode } from 'react'

interface ButtonProps {
    type : 'button' | 'submit' | 'reset' | undefined,
    disabled : boolean,
    children : ReactNode
}

export const FormButton: React.FC<ButtonProps> = ({ type, disabled, children }) => {
  return (
    <div>
        <button type={type} disabled={disabled} className={clsx(`
            px-6
            py-1.5
            sm:px-8
            sm:py-2 
            bg-indigo-950
            rounded-sm 
            text-white 
            font-medium 
            capitalize
            cursor-pointer
            transition-all 
            hover:bg-indigo-900
            active:duration-300 
            active:scale-[.93]`,
            disabled && " bg-slate-800 text-slate-500 hover:bg-slate-800 hover:cursor-default active:scale-[1]"
            )
          }
         >
            {children}
        </button>
    </div>
  )
}
