import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requiredSession } from "@/lib/auth";
import ChatBody from "@components/chat/chatBody";
import ChatHeader from "@components/chat/chatHeader";
import ChatInput from "@components/chat/chatInput";

const Page = async ({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) => {
  const { conversationId } = await params;

  const session = await requiredSession();

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId },
    include: { userOne: true, userTwo: true },
  });
  if (!conversation) redirect("/chat");

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: { sender: true },
  });

  return (
    <>
      <ChatHeader />
      <ChatBody
        messages={messages}
        receiver={conversation.userTwo}
        userSessionId={session.user.id}
      />
      <ChatInput conversationId={conversation.id} />
    </>
  );
};

export default Page;
