"use client"
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react'
import {BsPersonAdd} from "react-icons/bs"
import { AddUserModel } from './AddUserModel';

import { FullConversationType, FullMessageType } from '@/app/types';

import {ConversationBox} from "./ConversationBox"
import useConversation from '@/app/hooks/useConversation';
import  {CreateGroupModel}  from './CreateGroupModel';
import { Message, User } from '@prisma/client';
import { Avatar } from '@/app/components/sidebar/Avatar';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { ProfileDrawer } from '@/app/components/sidebar/ProfileDrawer';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/app/libs/pusher';
import { find } from 'lodash';


interface ConversationListProps {
    initialItems : FullConversationType[],
    initialUsers : User[],
    currentUser : User | null
}

export const ConversationList : React.FC<ConversationListProps> = ({ initialItems, initialUsers, currentUser }) => {
    const [conversations, setConversations] = useState(initialItems);
    const [users, setUsers] = useState(initialUsers);
    const [initialCurrentUser, setInitialCurrentUser ] = useState(currentUser);

    const [isGroup, setIsgroup] = useState<boolean>(false);
    const [model2Open, setModel2Open] = useState(false);

    const { conversationId, isOpen } = useConversation();
    const session = useSession();

    const pusherKey = useMemo(()=>{
        return session?.data?.user?.email
    }, [session?.data?.user?.email])

    useEffect(()=>{
        if (!pusherKey) {
            return;
        }

        pusherClient.subscribe(pusherKey);

        const updatedConversationHandler = (updatedConversation : { id : string, messages : any[]}) => {
            setConversations((currentConversations) => {
                return (
                    currentConversations.map((currentConversation) => {
                        if (currentConversation.id === updatedConversation.id) {
                            return {...currentConversation, messages : updatedConversation.messages }
                        }
                        return currentConversation
                    })
                )
            })
        } 

        const newConversationHandler = (newConversation : FullConversationType) => {
            setConversations((currentConversations) => {
                if(find(currentConversations, { id : newConversation.id })){
                    return currentConversations
                }

                return [newConversation, ...currentConversations]
            })
        }

        const deletedConversationHandler = (deletedConversation : { id : string }) => {
            setConversations((prevConversations) => {
                return (
                    prevConversations.filter((prevConversation) => prevConversation.id !== deletedConversation.id)
                )
            })
        }

        const updatedUserHandler = (updatedUser : { id : string, name : string, image : string }) => {
            setConversations((currentConversations) => {
                return (
                    currentConversations.map((currentConversation) => {
                        if (currentConversation.isGroup) {
                            return currentConversation;
                        }
                        
                        let updatedUsers;
                        if (currentConversation.userIds.includes(updatedUser.id)){
                            updatedUsers = currentConversation.users.map((user) => {
                                if (user.id === updatedUser.id) {
                                    return {...user, name : updatedUser.name, image : updatedUser.image }
                                }

                                return user;
                            })
                        }
                        else {
                            updatedUsers = currentConversation.users
                        }
                        
                        return {...currentConversation, users : updatedUsers};
                    })
                )
            });

            setUsers((currentUsers) => {
                return currentUsers.map((user) => {
                    if (user.id === updatedUser.id) {
                        return {...user, name : updatedUser.name, image : updatedUser.image}
                    }

                    return user
                })
            })

            if (updatedUser.id === initialCurrentUser?.id) {
                setInitialCurrentUser((prevCurrentUser) => {
                    return (
                        {...prevCurrentUser!, image : updatedUser.image, name : updatedUser.name}
                    )
                })
            }
        };

        pusherClient.bind("conversation:update", updatedConversationHandler);
        pusherClient.bind("conversation:delete", deletedConversationHandler);
        pusherClient.bind("conversation:new", newConversationHandler);
        pusherClient.bind("user:update", updatedUserHandler);

        return ()=>{
            pusherClient.unbind("conversation:update", updatedConversationHandler);
            pusherClient.unbind("conversation:delete", deletedConversationHandler);
            pusherClient.unbind("conversation:new", newConversationHandler);
            pusherClient.unbind("user:update", updatedUserHandler);

            pusherClient.unsubscribe(pusherKey);
        }
    }, [pusherKey])

  return (
    <>
    <div className={clsx('fixed w-full h-full mb-20 lg:mb-0 lg:w-80 lg:h-full lg:overflow-y-auto lg:flex flex-col bg-blue-600 z-0', isOpen ? "hidden" : "flex")}>
        <div className='sm:py-2 lg:py-4 max-sm:px-4 relative max-lg:bg-white max-lg:rounded-b-2xl'>
            <div className='h-full w-full flex items-center sm:justify-center'>
                <h1 className='text-2xl sm:text-3xl text-indigo-950 lg:text-white font-extrabold tracking-wider'>
                    MediChat
                </h1>
            </div>

            <Sheet defaultOpen={false}>
                <SheetTrigger className='lg:hidden'>
                    <div className='absolute w-10 h-10 rounded-full overflow-hidden right-4 sm:right-8 top-2 sm:top-4'>
                        <Avatar user={initialCurrentUser}/>
                    </div>
                </SheetTrigger>

                <ProfileDrawer user={initialCurrentUser} />
            </Sheet>
        </div>

        <div className='flex justify-around mt-8 lg:mt-6'>
            <div className={clsx('inline cursor-pointer', !isGroup ? "pb-1 border-b-2 border-indigo-950" : "" )} onClick={()=>setIsgroup(false)}>
                <p className={clsx('text-xl font-semibold', !isGroup ? "text-indigo-950" : "opacity-50")}>Chats</p>
            </div>
            <div className={clsx('inline cursor-pointer', isGroup ? "pb-1 border-b-2 border-indigo-950" : "" )} onClick={()=>setIsgroup(true)}>
                <p className={clsx('text-xl font-semibold', isGroup ? "text-indigo-950" : "opacity-50")}>Groups</p>
            </div>
        </div>

        { !isGroup &&
        <div className='flex justify-end pr-12 mt-2 sm:mt-4'>
            <div className='border-2 border-indigo-950 rounded-md cursor-pointer'>
                <AddUserModel />
            </div>
        </div>
        }

        { isGroup &&
        <div className='flex justify-end pr-12 mt-4'>
            <div className='border-2 border-indigo-950 rounded-md cursor-pointer'>
                <BsPersonAdd className='h-6 w-6 text-indigo-950' onClick={()=>setModel2Open(true)}/>
                <CreateGroupModel users={users} title='Create a New Group' modifytrigger={false} open={model2Open} setOpen={setModel2Open} />
            </div>
        </div>
        }

        <div className='mt-8 flex flex-col gap-2'>
            {
                conversations.map((conversation)=>{
                    let selected;
                    if (conversationId === conversation.id) selected = true
                    else selected = false
                    if (conversation.isGroup === isGroup) {
                        return <ConversationBox key={conversation.id} item={conversation} selected={selected}/>
                    }
                })
            }
        </div>
    </div>
    </>

  )
}
