
import { User } from "@prisma/client";
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export const useOtherUser = (users : User[]) => {
    
    const session = useSession();

    const otherUser = useMemo(()=>{
        const currentUserEmail = session?.data?.user?.email

        const otherUser = users.filter((user)=>user.email !== currentUserEmail)
        
        return otherUser[0];
    }, [session?.data?.user?.email, users])

    return otherUser;
}