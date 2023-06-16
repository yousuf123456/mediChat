
import { Avatar } from '@/app/components/sidebar/Avatar'
import { FullConversationType } from '@/app/types'
import React, { useCallback, useMemo, useState, useEffect } from 'react'

import { useOtherUser } from "../../hooks/useOtherUser"
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { GroupAvatar } from '@/app/components/sidebar/GroupAvatar'
import { format } from 'date-fns'
import { ActiveDot } from '@/app/components/sidebar/activeDot'
import { useActiveList } from '@/app/hooks/useActiveList'
import { find } from 'lodash'

interface conversationBoxProps {
    selected : boolean,
    item : FullConversationType
}

export const ConversationBox : React.FC<conversationBoxProps> = ({
    item,
    selected
}) => {
    const [count, setCount] = useState(0)

    const otherUser = useOtherUser(item.users);
    const router = useRouter() ;

    const { members } = useActiveList()
    const isActive = members.indexOf(otherUser?.email!) !== -1

    const handleClick = useCallback(() => {
        router.push(`/conversations/${item.id}`)
    }, [router, item.id])


    const lastMessage = useMemo(() => {
        const messages = item.messages || []

        return messages[messages.length - 1]
    }, [item.messages])


    const lastMessageText = useMemo(()=>{
        let lastMessageText;
        if (lastMessage) {
            if (lastMessage.image) {
                return lastMessageText = `${lastMessage?.sender?.name} sent an image`
            }
        }

        if (!lastMessage) {
            return lastMessageText = "Just created a conversation"
        }

        return lastMessageText = lastMessage.body
    }, [lastMessage])


    const session = useSession();
    const userEmail = useMemo(()=>{
        return session.data?.user?.email
    }, [session.data?.user?.email])


    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false
        }

        if (!userEmail) {
            return false
        }

        const myEmailInSeen = lastMessage.seen.filter((user)=>user.email === userEmail)

        if (myEmailInSeen.length === 0) {
            return false
        }
        
        return true
    }, [lastMessage, userEmail]);


    const unseenMessageCount = useMemo(()=>{
        let count = 0;

        if (userEmail) {
            for (let i = item.messages.length - 1; i >= 0; i--) {
                const message = item.messages[i];
                if (find(message.seen, { email : userEmail })) {
                    break;
                }

                count += 1
            }
        }

        return count;
    }, [userEmail, item]);

    const unseenMsgIndicatorColor = "bg-yellow-500"
    
  return (
    <div className={clsx('relative flex flex-row gap-4 px-3 py-2 items-center hover:bg-blue-500 cursor-pointer', selected ? "bg-white hover:bg-white" : "")} onClick={handleClick}>
            { item.isGroup ? (
                <div className='relative w-14 h-14 rounded-full overflow-hidden'>
                    <GroupAvatar users={item.users} size='h-5 w-5' />
                </div>
            ) 
            : (
                <div className='relative w-12 h-12'>
                    {isActive && <ActiveDot size='h-3 w-3'/>}
                    <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                        <Avatar user={otherUser} />
                    </div>
                </div>
            ) }

        <div className='flex flex-col justify-center items-start'>
            <p className={clsx('text-md font-medium', selected ? "text-indigo-950" : "text-white")}>{item.isGroup ? item.name : otherUser.name}</p>
            <p className={clsx("text-sm font-white overflow-hidden", hasSeen ? "opacity-50" : "opacity-100", selected ? "text-indigo-950" : "text-white")}>
                { lastMessageText?.length ? lastMessageText.length < 30 ? lastMessageText : (lastMessageText?.slice(0, 30) + ".....") : ""}
            </p>
            
        </div>
        
        {
            lastMessage?.createdAt && (
                <p className={clsx('text-xs font-light absolute top-0.5 right-2', unseenMessageCount !== 0 ? "text-green-400 font-medium opacity-100" : selected  ? "text-neutral-400" : "text-white opacity-60")}>
                    { format(new Date(lastMessage?.createdAt!), "h:mm a") }
                </p>
            )
        }

        {
            unseenMessageCount !== 0 && (
                <div className={clsx("absolute flex justify-center items-center right-4 bottom-1.5 w-5 h-5 bg-green-500 ring-[1.5px] ring-white rounded-full")}>
                    <p className='text-xs font-bold text-white'>{ unseenMessageCount }</p> 
                </div>
            )
        } 
    </div>
  )
}
