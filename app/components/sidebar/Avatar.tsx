
import { User } from 'next-auth';
import Image from 'next/image';
import React from 'react';

import "../../../public/images/placeholder.jpg"
import { Conversation } from '@prisma/client';
import { useActiveList } from '@/app/hooks/useActiveList';

interface AvatarProps {
    user? : User | null ,
    conversation? : Conversation,
    isGroup? : boolean,
    setIsOpen? :  React.Dispatch<React.SetStateAction<boolean>>
}

export const Avatar: React.FC<AvatarProps> = ({user, setIsOpen}) => {
  const { members } = useActiveList();

  const isActive = members.indexOf(user?.email!) !== -1;

  return (
    <div className={('flex justify-center relative w-full h-full rounded-full')}>
        <Image 
            alt = "avatar"
            src= {user?.image || "/images/placeholder.jpg"}
            onClick={()=>{if (setIsOpen) setIsOpen((prev)=>!prev)}}
            fill
            className='cursor-pointer object-cover hover:opacity-70 transition'
        />
    </div>
  )
}
