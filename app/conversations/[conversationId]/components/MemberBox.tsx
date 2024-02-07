"use client";
import { Avatar } from "@/app/components/sidebar/Avatar";
import { User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { use } from "react";

interface MemberBoxProps {
  user: User;
}

export const MemberBox: React.FC<MemberBoxProps> = ({ user }) => {
  const session = useSession();
  const router = useRouter();

  const me = session.data?.user?.name === user.name;

  const handleClick = () => {
    if (me || session.status === "loading") return;

    axios
      .post("/api/conversation", {
        user: user,
        isGroup: false,
        name: "",
        members: [],
      })
      .then((response) => {
        const data = response.data;
        router.push(`/conversations/${data.id}`);
      });
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-neutral-100"
    >
      <div className="w-8 h-8 relative rounded-full overflow-hidden">
        <Avatar user={user} />
      </div>

      <p className="text-sm font-medium text-indigo-950">
        {me ? "You" : user.name}
      </p>
    </div>
  );
};
