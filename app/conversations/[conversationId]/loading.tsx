import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { SkeletonDP } from "./components/SkeletonDP";
import { SkeletonContainer } from "./components/SkeletonContainer";
import { SkeletonMessage } from "./components/SkeletonMessage";

export default function Loading() {
  return (
    <div className="lg:pl-80 relative">
      <div className="w-full h-full">
        <div className="flex gap-8 items-center border-b-[1px] border-slate-200 py-4 sticky z-50 bg-white top-0 left-0">
          <SkeletonDP size="w-8 h-8 sm:w-10 sm:h-10 ml-6" />
          <div className="flex flex-col items-start gap-3">
            <SkeletonContainer size="w-36 h-6 sm:w-48 sm:h-8" />
            <SkeletonContainer size="w-24 h-3 sm:w-32 sm:h-4" />
          </div>
        </div>

        <div className="mt-12 pb-12 px-6 w-full h-full flex flex-col gap-16 overflow-y-auto">
          <SkeletonMessage
            skeleClassName="rounded-tr-none"
            className="justify-end"
            order="order-2"
          />

          <SkeletonMessage
            skeleClassName="rounded-tl-none"
            className="justify-start"
          />

          <SkeletonMessage
            skeleClassName="rounded-tl-none"
            className="justify-start "
          />

          <SkeletonMessage
            className="justify-end"
            skeleClassName="rounded-tr-none"
            order="order-2"
          />
        </div>
      </div>
    </div>
  );
}
