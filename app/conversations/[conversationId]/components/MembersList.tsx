import { Conversation, User } from "@prisma/client";
import React from "react";
import { MemberBox } from "./MemberBox";

interface MembersListProps {
  conversation: Conversation & {
    users: User[];
  };
}

export const MembersList: React.FC<MembersListProps> = ({ conversation }) => {
  return (
    <div className="w-full max-h-80 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-200 flex flex-col mt-4">
      {conversation.users.map((user) => {
        return <MemberBox user={user} key={user.id} />;
      })}
    </div>
  );
};
