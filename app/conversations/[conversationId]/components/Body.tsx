"use client";

import React, { useEffect, useRef, useState } from 'react'
import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import { Message, User } from '@prisma/client';
import { MessageBox } from './MessageBox';
import { pusherClient } from '@/app/libs/pusher';
import { FullMessageType } from '@/app/types';

import { find } from "lodash"

interface BodyProps {
    initialMessages : (Message & {
        seen: User[];
        sender: User;
    })[]
}

export const Body : React.FC<BodyProps> = ({ initialMessages }) => {

  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(()=>{
    axios.post(`/api/conversation/${conversationId}/seen`);
  }, [conversationId]);


  useEffect(()=>{
    axios.post(`/api/conversation/${conversationId}/seen`);
    pusherClient.subscribe(conversationId);

    const newMessageHandler = (message : FullMessageType) => {
      axios.post(`/api/conversation/${conversationId}/seen`);

      setMessages((currentMessages) => {
        if (find(currentMessages, { id : message.id })) {
          return (currentMessages)
        }

        return ([...currentMessages, message]);
      })

    };

    const updatedMessageHandler = (updatedMessage : FullMessageType) => {
      setMessages((currentMessages)=>{
        return (
          currentMessages.map((currentMessage)=>{
            if (currentMessage.id === updatedMessage.id) {
              return updatedMessage
            }
  
            return currentMessage;
          })
        )
      })
    }

    pusherClient.bind("messages:new", newMessageHandler);
    pusherClient.bind("message:update", updatedMessageHandler);

    return (()=>{
      pusherClient.unbind("messages:new", newMessageHandler);
      pusherClient.unbind("messages:update", updatedMessageHandler);
      pusherClient.unsubscribe(conversationId);
    }
    )
  }, [conversationId])

  return (
    <>
    {/* <div ref={bottomRef} className='hidden absolute bottom-0 w-full'/> */}

    <div
     className='w-full h-full overflow-y-auto bg-white px-2 py-6 sm:px-4 sm:py-8 scrollbar-thin scrollbar-track-neutral-100 scrollbar-thumb-blue-300'>
      {
        messages.map((message, index) => {
          return (
          <MessageBox 
            key={index}
            isLast = {index === messages.length - 1}
            message={message}
          />
          )
        })
      }
    </div>
    </>
  )
}
