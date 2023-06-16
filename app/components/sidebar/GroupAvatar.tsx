import { User } from '@prisma/client'
import React from 'react'
import { Avatar } from './Avatar'
import clsx from 'clsx'

type Props = {
    users : User[],
    size : string
}

export const GroupAvatar = ({ users, size }: Props) => {
  return (
    <div className='w-full h-full flex flex-wrap py-2 gap-0.5 justify-center items-center bg-white'>
        {
            users.map((user)=>{
                return (
                    <div key={user.id} className={clsx('relative rounded-full overflow-hidden', size)}>
                        <Avatar user={user} />
                    </div>
                )
            })
        }
    </div>
  )
}