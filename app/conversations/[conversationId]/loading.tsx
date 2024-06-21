import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { SkeletonDP } from "./components/SkeletonDP";
import { SkeletonContainer } from "./components/SkeletonContainer";
import { SkeletonMessage } from "./components/SkeletonMessage";

export default function Loading() {
  return (
    <div className="lg:pl-80 relative">
      <div className="px-3 w-full h-full">
        <div className="flex gap-5 items-center py-4 sticky z-50 bg-white top-0 left-0">
          <Skeleton className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full" />
          <div className="flex flex-col items-start gap-2">
            <Skeleton className="w-36 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
        </div>

        <div className="mt-12 pb-12 px-6 w-full h-full flex flex-col gap-4 overflow-y-auto">
          <SkeletonMessage className="justify-end" order="order-2" />

          <SkeletonMessage className="justify-start" />

          <SkeletonMessage className="justify-end" order="order-2" />

          <SkeletonMessage className="justify-start" />
        </div>
      </div>
    </div>
  );
}
