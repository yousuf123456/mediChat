import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../../components/ui/sheet";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../components/ui/alert-dialog";

import { Avatar } from "@/app/components/sidebar/Avatar";
import { useState } from "react";
import { MembersList } from "./MembersList";
import { LoadingButton } from "@/app/components/LoadingButton";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Doc } from "@/convex/_generated/dataModel";
import { User } from "@clerk/nextjs/dist/types/server";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";

interface DrawerProps {
  conversation: Doc<"conversations">;
  otherUsers: User[];
}

export function Drawer({ conversation, otherUsers }: DrawerProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const otherUser = otherUsers[0];

  const remove = useMutation(api.conversation.remove);

  const router = useRouter();

  const onDelete = () => {
    setIsLoading(true);

    remove({ conversationId: conversation._id })
      .then((res) => {
        toast.success(res);
        router.push("/conversations");
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
              <div className="relative w-16 h-16">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Avatar image={otherUser.imageUrl} />
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
              {conversation.name || otherUser.firstName}
            </p>
          </div>
        </SheetDescription>
      </SheetHeader>

      <div className="mt-12 flex flex-col gap-4">
        {!conversation.isGroup && (
          <>
            <div className="pl-2 flex flex-col">
              <p className="text-sm font-light text-zinc-500">Email</p>
              <p className="text-sm sm:text-base font-nunito font-medium text-black">
                {otherUser.emailAddresses[0]?.emailAddress}
              </p>
            </div>

            <div className="pl-2 flex flex-col">
              <p className="text-sm font-light text-zinc-500">Id</p>
              <p className="text-sm sm:text-base font-nunito font-medium text-black">
                {otherUser.id}
              </p>
            </div>
          </>
        )}

        <div className="pl-2 flex flex-col">
          <p className="text-sm font-light text-zinc-500">Joined On</p>
          <p className="text-sm lg:text-base font-nunito font-medium text-black">
            {new Date(conversation._creationTime).toLocaleString()}
          </p>
        </div>

        <div className="w-full pl-2 flex flex-col mt-4">
          {conversation.isGroup && (
            <>
              <p className="text-sm font-light text-zinc-500">Members</p>

              <MembersList otherUsers={otherUsers} />
            </>
          )}
        </div>
      </div>

      <div className="mt-12 flex w-full justify-end px-2">
        <AlertDialog open={open}>
          <LoadingButton
            variant={"secondary"}
            className="w-full h-11"
            onClick={() => setOpen(true)}
          >
            Delete
          </LoadingButton>

          <AlertDialogContent className="pt-0 px-0">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-nunito font-medium py-2 px-6">
                Delete User
              </AlertDialogTitle>
              <AlertDialogDescription className="px-6 text-base font-roboto">
                This action cannot be undone! This will completely remove
                your&apos;s conversation with this user. Do you want to delete
                this user ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="px-6 mt-6">
              <LoadingButton
                variant={"secondary"}
                disabled={isLoading}
                onClick={() => setOpen(false)}
              >
                Cancel
              </LoadingButton>
              <LoadingButton
                onClick={onDelete}
                disabled={isLoading}
                isLoading={isLoading}
                className="bg-black/80 hover:bg-black/75"
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
