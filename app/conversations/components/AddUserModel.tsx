"use client";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

import { DialogFooter } from "../../../components/ui/dialog";

import { ConfirmationDialog } from "@/components/Dialog";
import { BsPlus } from "react-icons/bs";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/app/components/sidebar/Avatar";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/app/components/inputs/Input";
import { DialogClose } from "@radix-ui/react-dialog";
import { LoadingButton } from "@/app/components/LoadingButton";
import { toast } from "react-hot-toast";

export function AddUserModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState<User | null>();
  const router = useRouter();

  const createConversation = useCallback(
    (user: User) => {
      setIsLoading(true);
      axios
        .post("../../api/conversation", {
          user: user,
          isGroup: false,
          name: "",
          members: [],
        })
        .then((response) => {
          const data = response.data;
          router.push(`/conversations/${data.id}`);
          toast.success("Added user successfully");
          setUser(null);
          setTimeout(() => setOpen(false), 1000);
        })
        .catch((e) => {
          toast.error("Something went wrong !");
        })
        .finally(() => setIsLoading(false));
    },
    [router]
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const searchUser: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post("../../api/searchUser", data)
      .then((response) => {
        const { data } = response;
        setUser(data);
        console.log(data);
      })
      .catch((e) => toast.error(e.response.data))
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
        <h2 className="mt-4 text-base sm:text-lg font-medium text-indigo-950">
          Search user by his Email or Id.
        </h2>

        <form onSubmit={handleSubmit(searchUser)}>
          <Input
            type="text"
            required={true}
            disabled={isLoading}
            register={register}
            id="email_id"
            placeholder="Type user email or id"
          />
          <LoadingButton
            className="mt-2"
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Search
          </LoadingButton>
        </form>

        {user && (
          <div className="mt-4 sm:mt-6 flex flex-row items-center gap-3 px-3 py-2 rounded-sm bg-neutral-100 hover:bg-neutral-200">
            <div className="w-8 h-8 relative rounded-full overflow-hidden">
              <Avatar user={user} />
            </div>
            <p className="text-base font-medium text-indigo-950">{user.name}</p>
          </div>
        )}

        <DialogFooter className="mt-6">
          <div className="flex gap-2 w-full justify-end">
            <LoadingButton
              disabled={isLoading}
              variant="outline"
              onClick={() => {
                setUser(null);
                setValue("email_id", "");
                setOpen(false);
              }}
            >
              Cancel
            </LoadingButton>

            <LoadingButton
              onClick={() => {
                if (user) {
                  createConversation(user);
                  setValue("email_id", "");
                }
              }}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Create
            </LoadingButton>
          </div>
        </DialogFooter>
      </ConfirmationDialog>
    </>
  );
}
