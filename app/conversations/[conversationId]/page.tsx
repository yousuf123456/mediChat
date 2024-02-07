import { EmptyState } from "@/app/(site)/components/EmptyState";
import { getConversationById } from "@/app/actions/getConversationById";
import { getMessages } from "@/app/actions/getMessages";
import React, { Suspense } from "react";
import { Header } from "./components/Header";
import { Body } from "./components/Body";
import { Footer } from "./components/Footer";

import Loading from "./loading";

interface IParams {
  conversationId: string;
}

export default async function conversationIdPage({
  params,
}: {
  params: IParams;
}) {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);

  if (!conversation) {
    return (
      <div className="h-full w-full lg:pl-80">
        <EmptyState />
      </div>
    );
  } else {
    return (
      <Suspense fallback={<Loading />}>
        <div className="h-full w-full lg:pl-80 relative">
          <div className="flex flex-col h-full">
            <Header conversation={conversation} />
            <Body initialMessages={messages} />
            <Footer />
          </div>
        </div>
      </Suspense>
    );
  }
}
