import { ConfirmationDialog } from "@/components/Dialog";
import React, { useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Input } from "../inputs/Input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "../LoadingButton";

type Props = {
  modifyTrigger?: boolean;
  isLoading: boolean;
  open: boolean;
  title: string;
  register: any;
  handleSubmit: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: SubmitHandler<FieldValues>;
};

export const EditNameDialog = ({
  modifyTrigger,
  isLoading,
  title,
  register,
  handleSubmit,
  open,
  setOpen,
  onSubmit,
}: Props) => {
  return (
    <ConfirmationDialog
      title={title}
      modifyTrigger={modifyTrigger}
      open={open}
      setOpen={setOpen}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="name"
          disabled={isLoading}
          register={register}
          placeholder="Type New Name"
          required={false}
          type="text"
        />
        <div className="mt-6 w-full flex gap-2 justify-end">
          <LoadingButton
            variant={"outline"}
            disabled={isLoading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </LoadingButton>

          <LoadingButton
            disabled={isLoading}
            isLoading={isLoading}
            type="submit"
          >
            Save
          </LoadingButton>
        </div>
      </form>
    </ConfirmationDialog>
  );
};
