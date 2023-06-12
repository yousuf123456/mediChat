import React, { useEffect } from 'react'
import { FieldErrors, FieldValues, UseFormGetValues, UseFormRegister, UseFormWatch } from 'react-hook-form'
import clsx from "clsx"
import { error } from 'console'

interface AuthInputProps {
    id : "email" | "name" | "password",
    placeholder : string,
    type : string,
    required : boolean,
    errors : FieldErrors<FieldValues>,
    disabled : boolean,
    register :  UseFormRegister<FieldValues>,
    watch : UseFormWatch<FieldValues>
}

const AuthInput: React.FC<AuthInputProps> = ({
    id,
    placeholder,
    type,
    required,
    register,
    errors,
    disabled,
    watch
})=>{ 

  const WatchFields = watch(["name", "email", "password"])

  const fieldsWatchIndex = {"name" : 0, "email" : 1, "password" : 2}

  return (
    <div>
        <input id={id} placeholder={placeholder} type={type} disabled={disabled} 
        {...register(id, { required : required })}
        className= { clsx ( `
            form-input
            w-full 
            py-2.5
            pl-3
            border-0
            ring-2
            ring-blue-200
            ring-inset
            text-[16px]
            font-medium
            rounded-sm
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-blue-500
            focus-visible:outline-none
            placeholder:text-slate-400
            placeholder:font-semibold 
            leading-6
            `,
            errors[id] && "focus:ring-rose-600",
            disabled && "opacity-50 cursor-default",
            WatchFields[fieldsWatchIndex[id]].length ? "ring-blue-500" : "ring-blue-200"

        )}
        />
    </div>
  )
}

export default AuthInput