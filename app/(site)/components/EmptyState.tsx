import React from "react";
import Image from "next/image";

export const EmptyState = () => {
  return (
    <div className="w-full h-full bg-zinc-100 flex flex-row justify-center align-middle">
      <div className="flex flex-col justify-center items-center gap-12">
        <Image
          width={300}
          height={300}
          src={"/images/chat.svg"}
          alt="Chatting illustration"
        />
        <h2 className="text-xl text-zinc-800 font-nunito text-center w-full max-w-lg">
          Connect with fellow chatters, vibe, share knowledge, and explore the
          world together.
        </h2>
      </div>
    </div>
  );
};
