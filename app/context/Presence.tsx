"use client";

import React from "react";
import { useHeartbeat } from "../hooks/useHeartbeats";
import { useUser } from "@clerk/nextjs";

export const Presence = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  useHeartbeat(user?.id || "unknown", 8000);

  return <>{children}</>;
};
