import clsx from 'clsx'
import React from 'react'
import { IconType } from 'react-icons'

interface AuthSocialButtonProps {
    disabled : boolean,
    icon : IconType,
    onClick : ()=>void
}

export const AuthSocialButton : React.FC<AuthSocialButtonProps> = ({
    icon : Icon,
    disabled,
    onClick
}) => {
  return (
    <div className='w-full'>
        <button type='button' disabled={disabled} onClick={onClick} className={clsx(`
         flex
         justify-center
         py-2
         w-full
         border-2
         border-indigo-950
         cursor-pointer
         hover:bg-slate-100
        `,
        disabled && "border-slate-500 hover:bg-white hover:cursor-default"
        )} >
            <Icon className={clsx('w-5 h-5 sm:w-6 sm:h-6 text-indigo-950 cursor-pointer', disabled && "text-slate-500 hover:cursor-default")} />
        </button>
    </div>
  )
}
