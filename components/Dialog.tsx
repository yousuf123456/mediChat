import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";

interface ConfirmationDialogProps {
  children: React.ReactNode;
  trigger?: any;
  modifyTrigger?: boolean;
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  children,
  trigger,
  modifyTrigger,
  title,
  open,
  setOpen,
}) => {
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        {!modifyTrigger ? (
          trigger
        ) : (
          <Button variant="destructive" className="rounded-sm px-6">
            {trigger}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="px-0 pt-0 text-white">
        <DialogHeader>
          <DialogTitle className="bg-pink-500 text-white font-nunito font-medium py-4 px-8 rounded-bl-2xl rounded-br-2xl">
            {title}
          </DialogTitle>

          <DialogDescription className="px-8 pt-4">
            {children}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
