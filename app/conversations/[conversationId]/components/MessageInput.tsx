"use client"

import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import React, { useState } from 'react'
import { HiPaperAirplane } from 'react-icons/hi';
import TextareaAutosize from 'react-textarea-autosize';

export const MessageInput = () => {
    const [message, setMessage] = useState<string>("")

    const { conversationId } = useConversation()

    const [audio] = useState(new Audio('/images/sendSound.wav'));

    const onChange = (e : React.ChangeEvent<HTMLTextAreaElement>)=>{
        setMessage(e.target.value)
    }

    const handleClick = ()=>{
        if (message) {
            axios.post("/api/messages", {
                message : message,
                conversationId : conversationId 
            })
            setMessage("");
            audio.play();
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleClick();
        }
    }

  return (
    <div className='flex gap-3 w-full h-full'>
        <div className='w-full h-full flex items-center'>
            <TextareaAutosize onKeyDown={handleKeyPress} autoFocus onChange={(e)=>onChange(e)} value={message} placeholder='Type Your Message' className='resize-none py-2 px-2 lg:py-3 lg:px-3 text-base font-medium bg-white w-full rounded-sm shadow-md focus-visible:outline-0'/>
        </div>

        <div className='flex items-center'>
            <div onClick={()=>{
                handleClick();
            }} className='rounded-full bg-blue-700 transition hover:bg-blue-900 hover:active:scale-90 py-2 px-2 cursor-pointer'>
                <HiPaperAirplane className='w-6 h-6 lg:h-6 lg:w-6 text-white rotate-90 cursor-pointer' />
            </div>
        </div>
    </div>
  )
}
