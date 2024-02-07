import { Conversation, User } from "@prisma/client";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../../components/ui/sheet";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../components/ui/alert-dialog";

import { useOtherUser } from "@/app/hooks/useOtherUser";
import { Avatar } from "@/app/components/sidebar/Avatar";
import { useMemo, useState } from "react";
import { MembersList } from "./MembersList";
import axios from "axios";
import useConversation from "@/app/hooks/useConversation";
import { LoadingButton } from "@/app/components/LoadingButton";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useActiveList } from "@/app/hooks/useActiveList";
import { ActiveDot } from "@/app/components/sidebar/activeDot";

interface DrawerProps {
  conversation: Conversation & {
    users: User[];
  };
}

export function Drawer({ conversation }: DrawerProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { members } = useActiveList();

  const router = useRouter();

  const otherUser = useOtherUser(conversation.users);

  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (!conversation.isGroup) {
      return isActive ? "Active" : "offline";
    }

    return conversation.users.length + " members";
  }, [conversation, isActive]);

  const { conversationId } = useConversation();

  const handleClick = () => {
    setIsLoading(true);
    axios
      .post(`/api/conversation/${conversationId}/delete`)
      .then(() => {
        toast.success("Deleted user successfully");
        router.push("/conversations");
        setTimeout(() => setOpen(false), 1000);
      })
      .catch((e) => {
        toast.error(e.response.data);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <SheetContent
      position="right"
      className="w-full min-[420px]:max-w-xl sm:max-w-sm"
    >
      <SheetHeader className="mt-2">
        {!conversation.isGroup && (
          <SheetTitle>
            <div className="w-full flex flex-row justify-center">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                {isActive && <ActiveDot size="h-3 w-3 sm:h-4 sm:w-4" />}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden">
                  <Avatar user={otherUser} />
                </div>
              </div>
            </div>
          </SheetTitle>
        )}
        <SheetDescription>
          <div className="w-full flex flex-col justify-center items-center">
            <p
              className={clsx(
                "font-medium text-indigo-950",
                conversation.name ? "text-xl" : "text-base"
              )}
            >
              {conversation.name || otherUser.name}
            </p>
            <p className="text-base font-normal text-neutral-500">
              {statusText}
            </p>
          </div>
        </SheetDescription>
      </SheetHeader>
      <div className="mt-12 flex flex-col gap-4">
        {!conversation.isGroup && (
          <>
            <div className="pl-2 flex flex-col">
              <p className="text-sm font-light text-neutral-400">Email</p>
              <p className="text-sm sm:text-base font-nunito font-medium text-indigo-950">
                {otherUser.email}
              </p>
            </div>

            <div className="pl-2 flex flex-col">
              <p className="text-sm font-light text-neutral-400">Id</p>
              <p className="text-sm sm:text-base font-nunito font-medium text-indigo-950">
                {otherUser.id}
              </p>
            </div>
          </>
        )}

        <div className="pl-2 flex flex-col">
          <p className="text-sm font-light text-neutral-400">Joined On</p>
          <p className="text-sm lg:text-base font-nunito font-medium text-indigo-950">
            {conversation.createdAt.toLocaleDateString()}
          </p>
        </div>

        <div className="w-full pl-2 flex flex-col items-center">
          {conversation.isGroup && (
            <>
              <p className="text-sm font-light font-nunito text-neutral-400">
                Members
              </p>
              <MembersList conversation={conversation} />
            </>
          )}
        </div>
      </div>

      <div className="mt-12 flex w-full justify-end px-2">
        <AlertDialog open={open}>
          <LoadingButton variant="destructive" onClick={() => setOpen(true)}>
            Delete
          </LoadingButton>

          <AlertDialogContent className="pt-0 px-0">
            <AlertDialogHeader>
              <AlertDialogTitle className="bg-pink-500 text-white font-nunito font-medium py-2 px-6 rounded-bl-2xl rounded-br-2xl">
                Delete User
              </AlertDialogTitle>
              <AlertDialogDescription className="px-6 pt-6 font-roboto">
                This action cannot be undone! This will completely remove
                your&apos;s conversation with this user. Do you want to delete
                this user ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="px-6 mt-4">
              <LoadingButton
                variant={"outline"}
                disabled={isLoading}
                onClick={() => setOpen(false)}
              >
                Cancel
              </LoadingButton>
              <LoadingButton
                onClick={handleClick}
                disabled={isLoading}
                isLoading={isLoading}
                className="bg-pink-500 hover:bg-pink-600"
              >
                Confirm
              </LoadingButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SheetContent>
  );
}
