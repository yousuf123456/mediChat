"use client";
import React from "react";
import { ClerkLoaded, ClerkLoading, ClerkProvider, useAuth } from "@clerk/nextjs";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export const ClerkContext = ({ children }: { children: React.ReactNode }) => {
  return (
    
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <ClerkLoading>
          <p>Clerk is loading...</p>
        </ClerkLoading>
        <ClerkLoaded>

        {children}
        </ClerkLoaded>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
