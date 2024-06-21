"use client";
import { Avatar } from "@/app/components/sidebar/Avatar";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import axios from "axios";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface MemberBoxProps {
  user: User;
}

export const MemberBox: React.FC<MemberBoxProps> = ({ user }) => {
  const data = useUser();
  const router = useRouter();

  const me = data.user?.id === user.id;

  const createConversation = useMutation(api.conversation.create);

  const handleClick = () => {
    if (me || !data.isLoaded || !data.isSignedIn) return;

    createConversation({ userIds: [user.id], isGroup: false }).then((res) => {
      toast.success("Succesfully Created The Conversation");
      router.push(`/conversations/${res}`);
    });
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100"
    >
      <div className="w-8 h-8 relative rounded-full overflow-hidden">
        <Avatar image={user.imageUrl} />
      </div>

      <p className="text-sm font-medium text-indigo-950">
        {me ? "You" : user.firstName}
      </p>
    </div>
  );
};
