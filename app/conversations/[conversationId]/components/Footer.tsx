"use client";
import React from "react";
import { CldUploadButton } from "next-cloudinary";

import { MessageInput } from "./MessageInput";
import useConversation from "@/app/hooks/useConversation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Cloud, File, Upload } from "lucide-react";
import { HiDocumentAdd } from "react-icons/hi";

export const Footer = ({
  updateMyPresence,
}: {
  updateMyPresence: (
    patch: Partial<{
      typing: boolean;
    }>
  ) => void;
}) => {
  const { conversationId } = useConversation();

  const sendMessage = useMutation(api.conversation.message);

  const onUpload = (result: any) => {
    sendMessage({
      conversationId: conversationId as Id<"conversations">,
      image: result?.info?.secure_url,
    });
  };

  return (
    <div className="h-fit py-3 px-3 z-50 sm:px-6 sticky bottom-0 left-0 bg-white w-full">
      <div className="flex items-center gap-2 w-full">
        <div className="h-full flex items-end">
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={(result: any) => {
              onUpload(result);
            }}
            uploadPreset="vmnlloyx"
          >
            <HiDocumentAdd className="w-8 h-8 text-zinc-500 cursor-pointer transition-all hover:text-zinc-600" />
          </CldUploadButton>
        </div>

        <div className="w-full">
          <MessageInput updateMyPresence={updateMyPresence} />
        </div>
      </div>
    </div>
  );
};
