"use client";

import useConversation from "@/app/hooks/useConversation";
import usePresence from "@/app/hooks/usePresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useMutation } from "convex/react";
import React, { useEffect, useState } from "react";
import { HiPaperAirplane } from "react-icons/hi";
import TextareaAutosize from "react-textarea-autosize";

export const MessageInput = ({
  updateMyPresence,
}: {
  updateMyPresence: (
    patch: Partial<{
      typing: boolean;
    }>
  ) => void;
}) => {
  const { user } = useUser();
  const { conversationId } = useConversation();

  const [message, setMessage] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    if (message.length === 0) return updateMyPresence({ typing: false });

    updateMyPresence({ typing: true });
    const timer = setTimeout(() => updateMyPresence({ typing: false }), 1500);
    return () => clearTimeout(timer);
  }, [message, updateMyPresence]);

  const sendMessage = useMutation(api.conversation.message);

  const handleSend = () => {
    if (message) {
      setMessage("");
      sendMessage({
        conversationId: conversationId as Id<"conversations">,
        message,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 w-full h-full">
      <div className="w-full h-full flex items-center">
        <TextareaAutosize
          onKeyDown={handleKeyPress}
          autoFocus
          onChange={(e) => onChange(e)}
          value={message}
          placeholder="Type Your Message"
          className="resize-none py-2 px-2 lg:py-3 lg:px-3 text-base font-medium bg-zinc-50 w-full rounded-sm focus-visible:outline-0"
        />
      </div>

      <div className="flex items-center">
        <div
          onClick={() => {
            handleSend();
          }}
          className="rounded-full bg-zinc-500 transition-colors hover:bg-zinc-600 hover:active:scale-90 py-2 px-2 cursor-pointer"
        >
          <HiPaperAirplane className="w-5 h-5 text-white rotate-90 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
