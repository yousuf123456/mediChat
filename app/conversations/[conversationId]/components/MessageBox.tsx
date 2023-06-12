"use client";
import { Avatar } from '@/app/components/sidebar/Avatar';
import { Message, User } from '@prisma/client';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import React from 'react'

import Image from 'next/image';

import {format} from "date-fns"
import { ActiveDot } from '@/app/components/sidebar/activeDot';

interface MessageBoxProps {
    isLast : boolean,
    isGroup? : boolean,
    message : (Message & {
        seen: User[];
        sender: User;
    })
}

export const MessageBox : React.FC<MessageBoxProps> = ({ isLast, message }) => {

    const session = useSession();
    const isOwn = session?.data?.user?.email === message?.sender?.email;

    const seenList = (message.seen || [])
    .filter((user)=> user.email !== session?.data?.user?.email)
    .map((user) => user.name)
    .join(", ")

    const container = clsx(
        "w-full flex gap-3 sm:gap-6 items-start py-2 lg:py-4",
        isOwn ? "justify-end" : "justify-start"
    )

    const avatar = clsx(
        "relative w-6 h-6 sm:w-9 sm:h-9 rounded-full overflow-hidden flex-shrink-0 mt-2",
        isOwn && "order-2"
    )

    const body = clsx(
        "flex flex-col gap-1",
        isOwn ? "items-start pl-3 sm:pl-6 lg:pl-8" : "items-end pr-3 sm:pr-6 lg:pr-8"
    )

    const messageContainer = clsx(
        "rounded-sm flex max-w-full w-fit relative text-base font-normal text-black",
        isOwn ? "bg-blue-600 justify-end" : "bg-green-100 justify-start",
        message.image ? "py-0 px-0 overflow-hidden transition" 
        : "py-2 px-3 sm:px-4"
    )

    const Message = clsx(
        "relative text-sm sm:text-base font-normal text-black transition",
        message.image ? "w-[232px] h-[232px] sm:w-[288px] sm:h-[288px] hover:scale-110" 
        : "",
        isOwn ? "text-white" : "text-black"
    )

  return (
    <div className={container}>
        <div className={avatar}>
            <Avatar user={message.sender} />
        </div>

        <div className={body}>
            <div className='flex justify-between w-full gap-2'>
                <p className='text-xs font-light text-neutral-500'>
                    { message?.sender?.name }
                </p>

                <p className='text-xs font-light text-neutral-500'>
                    { format(new Date(message?.createdAt!), "h:mm a") }
                </p>
            </div>

            <div className={clsx('w-full flex', isOwn ? "justify-end" : "justify-start")}>
                <div className={messageContainer}>
                    <p className={Message}>
                        { message?.image ? <Image src={message.image} alt="image" fill className='object-cover'/>  : message.body }          
                    </p>
                </div>
            </div>

            <div>
                <p className='text-xs font-lighter text-neutral-500'>
                    {
                        seenList && isOwn && isLast && "Seen by " + seenList
                    }
                </p>
            </div>
           
        </div>
    </div>
  )
}
