import { Input } from "@/components/ui/input";
import React from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

interface AuthInputProps {
  type: string;
  required: boolean;
  disabled: boolean;
  placeholder: string;
  id: "email" | "name" | "password";
  register: UseFormRegister<FieldValues>;
}

const AuthInput: React.FC<AuthInputProps> = ({
  id,
  type,
  register,
  disabled,
  required,
  placeholder,
}) => {
  return (
    <div>
      <Input
        id={id}
        type={type}
        className="w-full"
        disabled={disabled}
        placeholder={placeholder}
        {...register(id, { required: required })}
      />
    </div>
  );
};

export default AuthInput;
