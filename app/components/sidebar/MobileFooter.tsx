"use client"

import React from 'react'
import { DesktopSidebarItem } from './DesktopSidebarItem'

import { HiChat, HiLogout } from 'react-icons/hi'
import { signOut } from 'next-auth/react'
import useConversation from '@/app/hooks/useConversation'
import clsx from 'clsx'

export const MobileFooter = () => {
  const { isOpen } = useConversation();

  return (
    <div className={clsx('fixed lg:hidden flex justify-between items-center px-8 py-2 sm:py-4 h-18 w-full border-t-2 bottom-0 z-40', isOpen ? "hidden" : "block")}>
        <DesktopSidebarItem icon={HiChat} label="conversations" href="/conversations"/>
        <DesktopSidebarItem icon={HiLogout} label="logout" href="/" onClick={signOut}/>
    </div>
  )
}
