"use client"

import { Avatar } from '@/app/components/sidebar/Avatar';
import { useOtherUser } from '@/app/hooks/useOtherUser';
import { Conversation, User } from '@prisma/client';
import Link from 'next/link';
import React, { useMemo } from 'react'
import { HiChevronLeft, HiDotsHorizontal } from 'react-icons/hi';

import { Sheet, SheetTrigger } from "../../../../components/ui/sheet"
import { Drawer } from './Drawer';
import { useActiveList } from '@/app/hooks/useActiveList';
import { ActiveDot } from '@/app/components/sidebar/activeDot';

interface HeaderProps {
  conversation : (Conversation & {
              users: User[];
          })
}

export const Header : React.FC<HeaderProps> = ( { conversation } ) => {
  const otherUser = useOtherUser(conversation.users);
  // const [drawerOpen, setDrawerOpen] = useState(false)

  const { members } = useActiveList();

  const isActive = members.indexOf(otherUser?.email!) !== -1

  const statusText = useMemo(()=>{
    if (conversation.isGroup) {
      return conversation.users.length + " members"
    }

    return isActive ? "Active" : "offline"
  }, [conversation.users])

  return (
    <div className='flex flex-row justify-between items-center py-3 px-3 sm:px-6 border-b-2 border-neutral-300'>
      <div className='flex items-center gap-2 sm:gap-4'>
        <Link href={"/conversations"} className='lg:hidden'>
          <HiChevronLeft className='h-10 w-10 text-blue-600 hover:text-blue-800'/>
        </Link>
        <div className='flex gap-4 sm:gap-6 items-center'>
          {
              !conversation.isGroup && (
                <div className='relative w-10 h-10'>
                    {isActive && <ActiveDot size='h-2 w-2'/>}
                    <div className='relative w-10 h-10 rounded-full overflow-hidden'>
                        <Avatar user={otherUser} />
                    </div>
                </div>
              )
          }

          <div className='flex flex-col items-start gap-0'>
            <h1 className='text-lg sm:text-xl text-indigo-950 font-semibold capitalize'>
              {
                conversation.isGroup ? conversation.name : otherUser.name
              }
            </h1>

            <p className='text-sm text-neutral-500 font-normal'>
              { !conversation.isGroup && statusText}
            </p>
          </div>
          {
            conversation.isGroup && 
              (
                <div className='flex flex-col items-start gap-0'>
                  <div className='flex flex-row gap-[-5px] items-center'>
                  {
                    conversation.users.map((user, index)=>{
                      if (index < 5)
                      return (
                        <div key={user.id} className='w-5 h-5 relative rounded-full overflow-hidden'>
                          <Avatar user={user}/>
                        </div>
                      )
                      else {
                        return <p className='text-black text-2xl'>.</p>
                      }
                    })
                  }
                  </div>
                  <div className='text-sm text-neutral-500 font-normal'>
                    { statusText }
                  </div>
                </div>
              )
          }

        </div>
      </div>

      <Sheet>
        <SheetTrigger>
          <HiDotsHorizontal className='w-8 h-8 text-blue-400 transition hover:text-blue-600 cursor-pointer'/>
        </SheetTrigger>
        <Drawer 
          conversation={conversation}
        />
      </Sheet>
      {/* <HiDotsHorizontal onClick={()=>setDrawerOpen(true)} className='w-8 h-8 text-blue-400 transition hover:text-blue-600 cursor-pointer'/> */}
    </div>
  )
}
