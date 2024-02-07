import { Button } from "@/components/ui/button";
import clsx from "clsx";
import React, { ReactNode } from "react";

interface ButtonProps {
  type: "button" | "submit" | "reset" | undefined;
  disabled: boolean;
  children: ReactNode;
}

export const FormButton: React.FC<ButtonProps> = ({
  type,
  disabled,
  children,
}) => {
  return (
    <Button type={type} disabled={disabled} className="font-nunito bg-rose-500">
      {children}
    </Button>
  );
};
