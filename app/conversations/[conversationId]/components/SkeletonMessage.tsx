import React from "react";
import clsx from "clsx";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonMessageProps {
  className: string;
  order?: string;
}

export const SkeletonMessage: React.FC<SkeletonMessageProps> = ({
  className,
  order,
}) => {
  return (
    <div className={clsx("flex gap-4 w-full items-center", className)}>
      <Skeleton
        className={clsx("w-10 h-10 rounded-full flex-shrink-0", order)}
      />

      <div
        className={clsx(
          "flex flex-col gap-2 ",
          order === "order-2" && "items-end"
        )}
      >
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-64 rounded-lg" />
      </div>
    </div>
  );
};
