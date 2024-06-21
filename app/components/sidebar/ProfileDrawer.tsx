import React, { useState } from "react";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { Avatar } from "./Avatar";
import { BsCameraFill } from "react-icons/bs";
import { HiPencil } from "react-icons/hi";
import { EditNameDialog } from "./EditNameDialog";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import { UploadModel } from "./UploadModel";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { UserInformation } from "@/app/conversations/components/ConversationList";

interface ProfileDrawerProps {
  user: UserInformation | null;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ user }) => {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [nameModelOpen, setNameModelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: name || user?.name,
      image: user?.imageUrl,
    },
  });

  const image = watch("image");

  const onUpload = (result: any) => {
    setValue("image", result?.info?.secure_url);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/settings", data)
      .then((response) => {
        const data = response.data;
        toast.success("Updated Succesfully");
        setName(data.name);
        setTimeout(() => {
          setIsOpen(false);
          setNameModelOpen(false);
        }, 1000);
      })
      .catch((e) => {
        toast.error(e.response.data);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <UploadModel
        isLoading={isLoading}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onUpload={onUpload}
        image={image}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      />

      <SheetContent
        position="left"
        className="w-full min-[420px]:max-w-xl sm:max-w-sm pt-0 px-0 text-white"
      >
        <SheetHeader>
          <SheetTitle className="font-nunito font-medium text-xl px-6 py-3">
            Profile
          </SheetTitle>

          <SheetDescription className="px-6 pt-4">
            <div className="w-full flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 relative rounded-full overflow-hidden">
                  <Avatar image={user?.imageUrl} />
                </div>
              </div>

              <div className="w-full flex flex-col items-start mt-6">
                <div className="w-full flex justify-between items-center">
                  <p className="text-sm text-zinc-500 font-roboto font-light">
                    Name
                  </p>
                </div>

                <p className="text-base font-medium font-nunito text-black">
                  {name || user?.name}
                </p>
              </div>

              <div className="w-full flex flex-col items-start mt-6">
                <p className="text-sm text-zinc-500 font-roboto font-light">
                  Email
                </p>

                <p className="text-base font-medium font-nunito text-black">
                  {user?.emailAddress}
                </p>
              </div>

              <div className="w-full flex flex-col items-start mt-6">
                <p className="text-sm text-zinc-500 font-roboto font-light">
                  Id
                </p>

                <p className="text-base font-medium font-nunito text-black">
                  {user?.id}
                </p>
              </div>

              <div className="w-full flex justify-end mt-12">
                <Button
                  variant={"secondary"}
                  className="w-full"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </>
  );
};
