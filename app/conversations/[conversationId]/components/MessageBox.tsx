"use client";
import { Avatar } from "@/app/components/sidebar/Avatar";
import clsx from "clsx";
import React, { forwardRef } from "react";

import Image from "next/image";

import { format } from "date-fns";
import { Doc } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";

interface MessageBoxProps {
  sender: User;
  isLast: boolean;
  isGroup?: boolean;
  iAmSender: boolean;
  message: Doc<"messages">;
  seenUsersNamesList: string;
}

type Ref = HTMLDivElement;

export const MessageBox = forwardRef<Ref, MessageBoxProps>(
  ({ isLast, message, seenUsersNamesList, sender, iAmSender }, ref) => {
    const { user } = useUser();
    const isOwn = user?.id === message.senderId;

    const container = clsx(
      "w-full flex gap-3 sm:gap-6 items-center py-2 lg:py-4",
      isOwn ? "justify-end" : "justify-start"
    );

    const avatar = clsx(
      "relative w-6 h-6 sm:w-9 sm:h-9 rounded-full overflow-hidden flex-shrink-0 mt-2",
      isOwn && "order-2"
    );

    const body = clsx(
      "flex flex-col gap-1",
      isOwn
        ? "items-start pl-3 sm:pl-6 lg:pl-8"
        : "items-end pr-3 sm:pr-6 lg:pr-8"
    );

    const messageContainer = clsx(
      "rounded-lg flex max-w-full w-fit relative text-base font-normal text-black",
      !isOwn ? "bg-white justify-end" : "bg-zinc-500 justify-start",
      message.image
        ? "py-0 px-0 overflow-hidden transition"
        : "py-2 px-3 sm:px-4"
    );

    const Message = clsx(
      "relative text-sm md:text-base font-normal text-black transition",
      message.image
        ? "w-[232px] h-[232px] sm:w-[288px] sm:h-[288px] hover:scale-110"
        : "",
      isOwn ? "text-white" : "text-black"
    );

    return (
      <div className={container} ref={ref}>
        <div className={avatar}>
          <Avatar image={sender?.imageUrl} />
        </div>

        <div className={body}>
          <div className="flex justify-between w-full gap-2">
            <p className="text-xs font-light text-neutral-500">
              {iAmSender ? "You" : sender?.firstName}
            </p>

            <p className="text-xs font-light text-neutral-500">
              {format(new Date(message?._creationTime!), "h:mm a")}
            </p>
          </div>

          <div
            className={clsx(
              "w-full flex",
              isOwn ? "justify-end" : "justify-start"
            )}
          >
            <div className={messageContainer}>
              <p className={Message}>
                {message?.image ? (
                  <Image
                    src={message.image}
                    alt="image"
                    fill
                    className="object-cover"
                  />
                ) : (
                  message.body
                )}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-lighter text-neutral-500">
              {seenUsersNamesList &&
                isOwn &&
                isLast &&
                "Seen by " + seenUsersNamesList}
            </p>
          </div>
        </div>
      </div>
    );
  }
);
