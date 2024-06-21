import { ConfirmationDialog } from "@/components/Dialog";
import { DialogFooter } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { Select } from "./Select";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@/app/components/LoadingButton";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { Avatar } from "@/app/components/sidebar/Avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

interface CreateGroupModelProps {
  title: string;
  modifytrigger: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateGroupModel: React.FC<CreateGroupModelProps> = ({
  title,
  modifytrigger,
  open,
  setOpen,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<
    { emailAddress: string; imageUrl: string; id: string }[]
  >([]);

  const { register, watch, setValue, getValues } = useForm<FieldValues>({
    defaultValues: {
      search: "",
      groupName: "",
    },
  });

  const searchTerm = watch("search");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < 3) return;

    axios
      .post("../../api/searchUsers", { email_id: debouncedSearchTerm })
      .then(({ data }) => {
        const selectedSearchedUsers = searchedUsers.filter((user) =>
          selectedUserIds.includes(user.id)
        );

        setSearchedUsers([...selectedSearchedUsers, ...data]);
      })
      .catch((e) => console.log(e));
  }, [debouncedSearchTerm]);

  const handleCheckboxChange = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds((userIds) =>
        userIds.filter((userId) => userId !== userId)
      );
    } else {
      setSelectedUserIds((userIds) => [...userIds, userId]);
    }
  };

  const createConversation = useMutation(api.conversation.create);

  const router = useRouter();

  const onCreate = () => {
    if (selectedUserIds.length === 0) return;
    setIsLoading(true);

    createConversation({
      userIds: selectedUserIds,
      isGroup: true,
      groupName: getValues().groupName,
    })
      .then((res) => {
        setOpen(false);
        setSearchedUsers([]);
        setSelectedUserIds([]);
        router.push(`/conversations/${res}`);
        toast.success("Succesfully Created The Conversation");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <ConfirmationDialog
      title={title}
      modifyTrigger={modifytrigger}
      open={open}
      setOpen={setOpen}
    >
      <div className="flex flex-col gap-0">
        <h1 className="text-sm text-start font-roboto sm:text-base font-medium text-indigo-950">
          Group Name
        </h1>

        <Input
          {...register("groupName")}
          disabled={isLoading}
          type="text"
          required={true}
          placeholder="Type Group Name"
        />
      </div>

      <div className="mt-4 sm:mt-6">
        <h1 className="text-sm text-start sm:text-base font-roboto font-medium text-indigo-950">
          Search Members
        </h1>

        <Input
          type="text"
          required={true}
          disabled={isLoading}
          {...register("search")}
          placeholder="Type Users Email/Id"
        />
      </div>

      {searchedUsers.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {searchedUsers.map((user) => (
            <div
              className="px-4 py-3 rounded-xl bg-pink-50 flex justify-between w-full items-center cursor-pointer"
              // onClick={() => setUserId(user.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9">
                  <Avatar image={user.imageUrl} />
                </div>
                <p className="text-base text-zinc-800">{user.emailAddress}</p>
              </div>

              <Checkbox
                checked={selectedUserIds.includes(user.id)}
                onClick={() => handleCheckboxChange(user.id)}
              />
            </div>
          ))}
        </div>
      )}

      <DialogFooter className="mt-6">
        <div className="flex gap-2 w-full justify-end">
          <LoadingButton
            variant="outline"
            disabled={isLoading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            onClick={onCreate}
            isLoading={isLoading}
            disabled={isLoading || selectedUserIds.length === 0}
          >
            Create
          </LoadingButton>
        </div>
      </DialogFooter>
    </ConfirmationDialog>
  );
};
