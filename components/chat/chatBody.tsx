"use client";

import type { Message, User } from "@/generated/prisma/client";
import { shortDateTimeFormatter } from "@/lib/utils";
import { Bubble, BubbleContent, BubbleGroup } from "@components/ui/bubble";

type ChatBodyProps = {
  messages: Message[];
  receiver: User;
  userSessionId: string;
};

const ChatBody = ({ messages, receiver, userSessionId }: ChatBodyProps) => {
  return (
    <div className="h-full overflow-y-scroll px-2">
      <BubbleGroup className="max-h-100">
        {messages.length <= 0 && (
          <p className="w-full h-full flex justify-center items-center">
            <span className="px-4 py-1 bg-secondary text-sm rounded-full">
              Say Hi to {receiver.username}
            </span>
          </p>
        )}
        {messages.map((message) => (
          <Bubble
            key={message.id}
            variant="secondary"
            align={`${userSessionId === message.senderId ? "end" : "start"}`}
          >
            <BubbleContent>
              <p className="text-foreground">{message.content}</p>
              <span className="text-xs text-chart-2">
                {shortDateTimeFormatter.format(message.createdAt)}
              </span>
            </BubbleContent>
          </Bubble>
        ))}
      </BubbleGroup>
    </div>
  );
};

export default ChatBody;
