import clsx from "clsx";
import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  id: string;
  placeholder?: string;
  disabled?: boolean;
  required: boolean;
  type: React.HTMLInputTypeAttribute;
  className?: string;
  register: UseFormRegister<FieldValues>;
}

export const Input: React.FC<InputProps> = ({
  id,
  placeholder,
  disabled,
  type,
  required,
  className,
  register,
}) => {
  return (
    <input
      disabled={disabled}
      type={type}
      {...register(id, { required })}
      placeholder={placeholder}
      id={id}
      className={clsx(
        "w-full text-sm text-neutral-600 font-medium mt-2 py-2 sm:py-3 px-2 sm:px-4 focus-visible:outline-none rounded-sm ring-2 ring-inset ring-pink-300 focus-visible:ring-pink-500",
        disabled && "ring-neutral-300 text-neutral-300 opacity-60",
        className
      )}
    />
  );
};
