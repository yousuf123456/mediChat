import React, { useState } from 'react'

import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
  } from "../../../components/ui/sheet"
import { Avatar } from './Avatar'
import { User } from '@prisma/client'
import {  BsCameraFill } from 'react-icons/bs'
import { HiPencil } from 'react-icons/hi'
import { EditNameDialog } from './EditNameDialog'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { DialogClose } from '@radix-ui/react-dialog'
import { UploadModel } from './UploadModel'

interface ProfileDrawerProps {
    user : User | null,
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ user }) => {

    const [name, setName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [nameModelOpen, setNameModelOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register,
        handleSubmit,
        setValue, 
        watch, 
        formState : {errors} 

    } = useForm({ defaultValues : {
        "name" : name || user?.name,
        "image" : user?.image
    } })

    const image = watch("image");

    const onUpload = (result : any) => {
        setValue("image", result?.info?.secure_url);
    };

    const onSubmit : SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios.post("/api/settings", data)
        .then((response)=>{
            const data = response.data
            toast.success("Updated Succesfully");
            setName(data.name);
            setTimeout(()=>{
                setIsOpen(false)
                setNameModelOpen(false)
            }, 1000);
        })
        .catch((e)=>{
            toast.error(e.response.data)
        })
        .finally(()=>setIsLoading(false))
    }

  return (
    <>
    <UploadModel 
        isLoading={isLoading}
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        onUpload={onUpload} 
        image={image} 
        handleSubmit={handleSubmit} 
        onSubmit={onSubmit} 
    />

    <SheetContent position="left" className="w-full min-[420px]:max-w-xl sm:max-w-sm pt-0 px-0 text-white">
        <SheetHeader>

            <SheetTitle className='bg-indigo-950 text-white text-xl px-6 py-3 rounded-bl-2xl rounded-br-2xl'>
                Profile
            </SheetTitle>

        <SheetDescription className='px-6 pt-4'>
            <div className='w-full flex flex-col items-center'>
                <div className='relative'>
                    <DialogClose>
                        <div onClick={()=>{
                            setIsOpen(true)}} className='cursor-pointer z-10 absolute right-[-8px] bottom-0 p-2 bg-indigo-950 rounded-full flex justify-center items-center'>
                            <BsCameraFill className='w-4 h-4 text-white' />
                        </div>
                    </DialogClose>
                    
                    <div className='w-20 h-20 relative rounded-full overflow-hidden'>
                        <Avatar user={user}/>
                    </div>
                </div>

                <div className='w-full flex flex-col items-start mt-6'>
                    <div className='w-full flex justify-between items-center'>
                        <p className='text-sm text-neutral-500 font-light'>Name</p>
                        <HiPencil onClick={()=>setNameModelOpen(true)} className='w-4 h-4 text-indigo-950 cursor-pointer' />
                        <EditNameDialog open={nameModelOpen} 
                            setOpen={setNameModelOpen} 
                            title='Edit your public name' 
                            isLoading={isLoading}
                            modifyTrigger={false} 
                            register={register} 
                            onSubmit={onSubmit} 
                            handleSubmit={handleSubmit}
                        />
                    </div>

                    <p className='text-base font-medium text-indigo-950'>
                        { name || user?.name }
                    </p>
                </div>

                <div className='w-full flex flex-col items-start mt-6'>
                    <p className='text-sm text-neutral-500 font-light'>Email</p>

                    <p className='text-base font-medium text-indigo-950'>
                        { user?.email }
                    </p>
                </div>

                <div className='w-full flex flex-col items-start mt-6'>
                    <p className='text-sm text-neutral-500 font-light'>Id</p>

                    <p className='text-base font-medium text-indigo-950'>
                        { user?.id }
                    </p>
                </div>
            </div>
        </SheetDescription>

        </SheetHeader>

    </SheetContent>
    </>
  )
}
