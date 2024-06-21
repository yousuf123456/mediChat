import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export const ConversationBoxLoading = () => {
  return (
    <div className="flex items-center px-3 py-2.5 gap-4">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />

      <div className="flex flex-col items-start gap-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-52" />
      </div>
    </div>
  );
};
