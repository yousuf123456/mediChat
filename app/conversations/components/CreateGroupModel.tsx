import { ConfirmationDialog } from '@/components/Dialog'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import React, { useState } from 'react'
import { Select } from './Select'
import { User } from '@prisma/client'
import { FieldValues, useForm } from 'react-hook-form'
import { Input } from '@/app/components/inputs/Input'
import { LoadingButton } from '@/app/components/LoadingButton'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface CreateGroupModelProps {
    title : string,
    modifytrigger : boolean,
    open : boolean,
    setOpen : React.Dispatch<React.SetStateAction<boolean>>,
    users : User[]
}

export const CreateGroupModel: React.FC<CreateGroupModelProps> = ({ 
    title,
    modifytrigger,
    open,
    setOpen,
    users
 }) => {

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { register, watch, setValue, getValues } = useForm<FieldValues>({defaultValues : {
        search : "",
        groupName : ""
    }})

    const onCreate = () => {
        setIsLoading(true);
        axios.post("/api/conversation", {
            members : selectedUsers,
            name : getValues("groupName"),
            isGroup : true
        })
        .then(()=>{
            toast.success("Created a group successfully");
            setTimeout(()=>setOpen(false), 1000)
        })
        .catch((e)=>{
            toast.error(e.response.data);
        })
        .finally(()=>setIsLoading(false))
    }

  return (
    <ConfirmationDialog title={title} modifyTrigger={modifytrigger} open={open} setOpen={setOpen}>
        <div className='flex flex-col gap-0'>
            <h1 className='text-base font-medium text-indigo-950'>
                Group Name
            </h1>
            <Input id="groupName" disabled={isLoading} type='text' register={register} required={true} placeholder='Type Group Name'/>
        </div>

        <div className='mt-4 sm:mt-6'>
            <h1 className='text-base font-medium text-indigo-950'>
                Members
            </h1>
            <Select users={users} disabled={isLoading} register={register} watch={watch} setValue={setValue} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/>
        </div>

        <DialogFooter className='mt-6'>
            <div className='flex gap-2 w-full justify-end'>
                <LoadingButton variant='outline' disabled={isLoading} onClick={()=>setOpen(false)}>
                    Cancel
                </LoadingButton>
                <LoadingButton onClick={onCreate} disabled={isLoading} isLoading={isLoading}>
                    Create
                </LoadingButton>
            </div>
        </DialogFooter>
    </ConfirmationDialog>
  )
}
