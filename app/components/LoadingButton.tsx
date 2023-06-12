import React from 'react'
import {Button} from "../../components/ui/button"
import { Loader2 } from "lucide-react"
import clsx from 'clsx'

type Props = {
    variant? :  "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined,
    type? : "button" | "submit" | "reset",
    loaderColor? : string,
    isLoading? : boolean,
    disabled? : boolean,
    children : React.ReactNode,
    className? : string,
    onClick? : ()=>void,
}

export const LoadingButton = ({ variant, 
  onClick, 
  isLoading, 
  children, 
  disabled, 
  type,
  loaderColor,
  className }: Props) => {

  return (
    <Button onClick={onClick} 
    type={type} 
    variant={variant} 
    disabled={disabled} 
    className={clsx( !variant && " bg-blue-600 py-2 px-4 sm:px-6 text-white font-medium rounded-sm hover:bg-blue-800", "h-9", className, disabled && !className && !variant && "bg-blue-800 text-neutral-300")}>
        { isLoading && <Loader2 className={clsx("mr-2 h-4 w-4 animate-spin", loaderColor ? loaderColor : "text-white")} /> }
        { children }
    </Button>
  )
}