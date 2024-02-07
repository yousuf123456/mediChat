import clsx from "clsx";
import React from "react";
import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  disabled: boolean;
  icon: IconType;
  onClick: () => void;
}

export const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  disabled,
  onClick,
}) => {
  return (
    <div className="w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={clsx(
          `
         flex
         py-2
         w-full
         border-[1px]
         justify-center
         cursor-pointer
         transition-colors
         border-rose-500
         hover:bg-pink-50
        `,
          disabled && "opacity-60 hover:cursor-default"
        )}
      >
        <Icon
          className={clsx(
            "w-5 h-5 sm:w-6 sm:h-6 text-rose-500 cursor-pointer",
            disabled && "opacity-60 hover:cursor-default"
          )}
        />
      </button>
    </div>
  );
};
