"use client"
import React from 'react'
import { CldUploadButton } from "next-cloudinary"

import { HiDocumentAdd } from "react-icons/hi"
import { MessageInput } from './MessageInput'
import axios from 'axios'
import useConversation from '@/app/hooks/useConversation'

export const Footer = () => {

  const { conversationId } = useConversation()

  const onUpload = (result : any)=>{
    axios.post("/api/messages", {
      image : result?.info?.secure_url,
      conversationId : conversationId
    })
  }

  return (
    <div className='py-3 px-3 sm:px-6 bg-blue-200 w-full'>
        <div className='flex items-end gap-2 w-full'>
            <div className='h-full flex items-end'>
              <CldUploadButton
               options={
                {maxFiles : 1}
               }
               onUpload={(result : any)=>{onUpload(result)}}
               uploadPreset='vmnlloyx'
              >
                <HiDocumentAdd className='w-9 h-9 sm:w-10 sm:h-10 text-blue-700 cursor-pointer transition hover:text-blue-900'/>
              </CldUploadButton>
            </div>

            <div className='w-full'>
                <MessageInput />
            </div>
        </div>
    </div>
  )
}
