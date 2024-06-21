import React from "react";
import { MemberBox } from "./MemberBox";
import { User } from "@clerk/nextjs/dist/types/server";

interface MembersListProps {
  otherUsers: User[];
}

export const MembersList: React.FC<MembersListProps> = ({ otherUsers }) => {
  return (
    <div className="w-full max-h-80 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-200 flex flex-col mt-1">
      {otherUsers.map((user) => {
        return <MemberBox user={user} key={user.id} />;
      })}
    </div>
  );
};
