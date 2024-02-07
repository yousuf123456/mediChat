import React from "react";
import { SkeletonDP } from "./SkeletonDP";
import { SkeletonContainer } from "./SkeletonContainer";
import clsx from "clsx";
import { cn } from "@/lib/utils";

interface SkeletonMessageProps {
  skeleClassName?: string;
  className: string;
  order?: string;
}

export const SkeletonMessage: React.FC<SkeletonMessageProps> = ({
  skeleClassName,
  className,
  order,
}) => {
  return (
    <div className={clsx("flex gap-4 w-full items-start", className)}>
      <SkeletonDP size={clsx("w-10 h-10 ", order)} />
      <div className="flex flex-col gap-2 w-5/6 sm:w-1/2">
        <div className="w-full flex justify-between">
          <SkeletonContainer size="w-12 h-2 sm:h-3" />
          <SkeletonContainer size="w-12 h-2 sm:h-3" />
        </div>

        <div>
          <SkeletonContainer
            size={cn(
              "w-full sm:w-full h-14 sm:h-16 rounded-3xl",
              skeleClassName
            )}
          />
        </div>
      </div>
    </div>
  );
};
