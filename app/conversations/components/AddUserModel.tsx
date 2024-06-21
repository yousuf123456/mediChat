"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { DialogFooter } from "../../../components/ui/dialog";

import { ConfirmationDialog } from "@/components/Dialog";
import { BsPlus } from "react-icons/bs";
import { Avatar } from "@/app/components/sidebar/Avatar";
import { LoadingButton } from "@/app/components/LoadingButton";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export function AddUserModel() {
  const [email_id, setEmail_id] = useState("");
  const [debouncedEmail_id] = useDebounce(email_id, 500);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [searchedUsers, setSearchedUsers] = useState<
    { emailAddress: string; imageUrl: string; id: string }[]
  >([]);

  const [userId, setUserId] = useState<string | null>();
  const router = useRouter();

  useEffect(() => {
    if (!debouncedEmail_id || debouncedEmail_id.length < 3) return;

    axios
      .post("../../api/searchUsers", { email_id: debouncedEmail_id })
      .then((res) => setSearchedUsers(res.data))
      .catch((e) => console.log(e));
  }, [debouncedEmail_id]);

  const createConversation = useMutation(api.conversation.create);

  const onCreateConversation = () => {
    if (!userId) return;
    setIsLoading(true);

    createConversation({ userIds: [userId], isGroup: false })
      .then((res) => {
        setOpen(false);
        setUserId(null);
        setSearchedUsers([]);
        router.push(`/conversations/${res}`);
        toast.success("Succesfully Created The Conversation");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <BsPlus
        onClick={() => setOpen(true)}
        className="w-5 h-5 text-indigo-950"
      />

      <ConfirmationDialog
        modifyTrigger={false}
        title="Add New User"
        open={open}
        setOpen={setOpen}
      >
        <div className="flex flex-col gap-1">
          <h2 className="mt-4 text-sm sm:text-base font-roboto text-start font-medium text-indigo-950">
            Search user by his Email or Id.
          </h2>

          <div className="relative flex flex-col gap-8">
            <Input
              autoComplete="off"
              value={email_id}
              onChange={(e) => setEmail_id(e.target.value)}
              type="text"
              required={true}
              disabled={isLoading}
              placeholder="Type user email or id"
            />

            {searchedUsers.length > 0 && (
              <RadioGroup value={userId || ""}>
                <div className="flex flex-col gap-2">
                  {searchedUsers.map((user, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 rounded-xl bg-pink-50 flex justify-between w-full items-center cursor-pointer"
                      onClick={() => setUserId(user.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9">
                          <Avatar image={user.imageUrl} />
                        </div>
                        <p className="text-base text-zinc-800">
                          {user.emailAddress}
                        </p>
                      </div>

                      <RadioGroupItem value={user.id} id={user.id} />
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {searchedUsers.length === 0 && (
              <p className="w-full text-center text-lg text-black">
                No Users Found
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-12">
          <div className="flex gap-2 w-full justify-end">
            <LoadingButton
              disabled={isLoading}
              variant="outline"
              onClick={() => {
                setUserId(null);
                setEmail_id("");
                setOpen(false);
              }}
            >
              Cancel
            </LoadingButton>

            <LoadingButton
              isLoading={isLoading}
              onClick={onCreateConversation}
              disabled={isLoading || !userId}
            >
              Create
            </LoadingButton>
          </div>
        </DialogFooter>
      </ConfirmationDialog>
    </>
  );
}
