import Image from "next/image";
import React from "react";

export const PageLoading = () => {
  return (
    <div className="flex items-center justify-center h-full flex-col gap-3">
      <div className=" animate-pulse">
        <Image
          width={100}
          height={100}
          src={"/images/logo.png"}
          alt="Application Logo"
        />
      </div>
    </div>
  );
};
