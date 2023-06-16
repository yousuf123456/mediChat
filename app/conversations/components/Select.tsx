"use client"
import React, { useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { HiChevronDown, HiChevronUp, HiX } from 'react-icons/hi'
import { User } from '@prisma/client'
import { Avatar } from '@/app/components/sidebar/Avatar'
import { Input } from '@/app/components/inputs/Input'
import { FieldValues, UseFormRegister, UseFormSetValue, UseFormWatch, useForm } from 'react-hook-form'
import clsx from 'clsx'

type Props = {
    users : User[],
    selectedUsers : never[],
    setSelectedUsers : React.Dispatch<React.SetStateAction<never[]>>,
    register : UseFormRegister<FieldValues>,
    watch : UseFormWatch<FieldValues>,
    setValue : UseFormSetValue<FieldValues>,
    disabled? : boolean
}

const UserSearch = (users : User[], searchedQuery : string) => {
    let closestUser : User | null = null;
    let closestDistance = -1;

    var stringSimilarity = require("string-similarity");
    users.forEach((user : User) => {
    const distance = stringSimilarity.compareTwoStrings(user?.name, searchedQuery);
    if (distance > closestDistance) {
        closestUser = user;
        closestDistance = distance;
    }})
  
    if (closestUser) {
        return closestUser;
    }
};

export const Select = ( {users, 
    selectedUsers, 
    disabled, 
    setSelectedUsers,  
    register, 
    watch, 
    setValue} : Props) => {

    const [closestUser, setClosestUser] = useState<User | undefined >()

    const deletePerson = (index : number) => {
        setSelectedUsers((prevSelectedPeople) =>
          prevSelectedPeople.filter((_, i) => i !== index)
        );
    };

    const searchedUserName = watch("search");
    useEffect(()=>{
        if (searchedUserName) {
            setClosestUser(UserSearch(users, searchedUserName))
        }
    }, [searchedUserName, users])

  return (
    <Listbox disabled={disabled} value={selectedUsers} onChange={setSelectedUsers} multiple>
        { ({ open }) => (
            <>
            <div className='flex gap-2 items-center px-2 py-2 justify-between border-2 rounded-sm'>
                <div className='flex flex-wrap gap-2'>

                    {selectedUsers.map((person : User, index) => {
                        return (
                            <div key={index} className='px-2 py-2 flex gap-2 items-center bg-blue-100 rounded-sm'>
                                <h3 className='text-xs font-normal text-indigo-950'>
                                    { person.name }
                                </h3>
                                <HiX onClick={()=>deletePerson(index)} className='w-4 h-4 text-red-500 cursor-pointer hover:text-red-800'/>
                            </div>
                        )
                    })}

                </div>
                <Listbox.Button className={"flex gap-2"}>
                    { <>|<HiChevronDown className={clsx('w-6 h-6 text-indigo-950 transition-transform duration-500', open && "rotate-180")}/></>}
                </Listbox.Button>
            </div>

            <Transition
                enter="transition duration-300 ease"
                enterFrom="transform scale-95 h-0 opacity-0"
                enterTo="transform scale-100 h-full opacity-100"
                leave="transition duration-200 ease-in-out"
                leaveFrom="transform scale-100 h-full opacity-100"
                leaveTo="transform scale-95 h-0 opacity-0"
            >
            { open && (
                <div className='max-h-[160px] mt-2 scrollbar-thin scrollbar-thumb-blue-200 overflow-y-auto flex flex-col w-full border-x-2'>
                    <Listbox.Options static>
                    <div className='px-2 mb-2'>
                        <Input placeholder='Search user name' id="search" type='text' required={false} register={register} className="mt-0" />
                    </div>

                    {
                        !searchedUserName ? (
                            users?.map((person) => (
                                <Listbox.Option key={person.id} value={person}>
                                <div className='flex items-center py-2 px-4 gap-2 hover:bg-blue-100 cursor-pointer'>
                                    <div className='w-6 h-6 relative rounded-full overflow-hidden'>
                                        <Avatar user={person}/>
                                    </div>
                                    <h1 className='text-sm text-indigo-950'>{person.name}</h1>
                                </div>
                                </Listbox.Option>
                            ))
                        )

                        : (
                            closestUser && (

                                <Listbox.Option onClick={()=>setValue("search", "")} key={closestUser.id} value={closestUser}>
                                    <div className='flex items-center py-2 px-4 gap-2 hover:bg-blue-100 cursor-pointer'>
                                        <div className='w-6 h-6 relative rounded-full overflow-hidden'>
                                            <Avatar user={closestUser}/>
                                        </div>
                                        <h1 className='text-sm text-indigo-950'>{closestUser.name}</h1>
                                    </div>
                                </Listbox.Option>

                            )
                        )
                    }
                    </Listbox.Options>
                </div>
            )}
            </Transition>
            </>
            )}
    </Listbox>
  )
}