"use client";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

import { DialogFooter } from "../../../components/ui/dialog";

import { ConfirmationDialog } from "@/components/Dialog";
import { BsPlus } from "react-icons/bs";
import { Avatar } from "@/app/components/sidebar/Avatar";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { LoadingButton } from "@/app/components/LoadingButton";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";

export function AddUserModel() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [autocompletes, setAutocompletes] = useState<{ email: string }[]>([]);
  const [open2, setOpen2] = useState(false);

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

  const { register, handleSubmit, setValue, watch } = useForm();

  const email_id = watch("email_id");

  useEffect(() => {
    if (!email_id) return;

    axios
      .post("../../api/getEmailAutocompletes", { email: email_id })
      .then((res) => setAutocompletes(res.data))
      .catch((e) => console.log(e));
  }, [email_id]);

  const onAutocompleteClick = (value: string) => {
    setValue("email_id", value);
  };

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
        <form onSubmit={handleSubmit(searchUser)}>
          <div className="flex flex-col gap-2">
            <h2 className="mt-4 text-base font-roboto text-start font-medium text-indigo-950">
              Search user by his Email or Id.
            </h2>

            <div className="relative">
              <Input
                autoComplete="off"
                {...register("email_id", { required: true })}
                type="text"
                required={true}
                disabled={isLoading}
                onFocus={(e) => setOpen2(true)}
                onBlur={(e) =>
                  setTimeout(() => {
                    setOpen2(false);
                  }, 500)
                }
                placeholder="Type user email or id"
              />

              {open2 && autocompletes.length > 0 && (
                <div className="absolute flex flex-col items-start gap-0 p-1 top-12 left-0 right-0 h-44 overflow-y-auto bg-white shadow-lg rounded-md z-[99999]">
                  {autocompletes.map((autoComplete, i) => (
                    <div
                      key={i}
                      onClick={() => onAutocompleteClick(autoComplete.email)}
                      className="px-4 py-2 rounded-sm hover:bg-neutral-100 w-full flex justify-start"
                    >
                      <p className=" font-nunito text-black ">
                        {autoComplete.email}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <LoadingButton
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              className="mt-2 w-fit"
            >
              Search
            </LoadingButton>
          </div>
        </form>

        {user && (
          <div className="mt-4 sm:mt-6 flex flex-row items-center gap-3 px-3 py-2 rounded-sm bg-neutral-100 hover:bg-neutral-200">
            <div className="w-8 h-8 relative rounded-full overflow-hidden">
              <Avatar user={user} />
            </div>
            <p className="text-base font-medium text-indigo-950">{user.name}</p>
          </div>
        )}

        <DialogFooter className="mt-12">
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
