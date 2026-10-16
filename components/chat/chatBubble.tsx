"use client";

import Image from "next/image";
import { SetStateAction, useState } from "react";
import { LoaderCircle, Pencil, Send, Trash } from "lucide-react";

import type { Message } from "@/generated/prisma/client";
import { shortDateTimeFormatter } from "@/lib/utils";
import { Bubble, BubbleContent } from "@components/ui/bubble";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";

const formatMessageDate = (value: Date | string) => {
  const date = new Date(value);
  return shortDateTimeFormatter.format(date);
};

type ChatBubbleProps = {
  message: Message;
  userSessionId: string;
  conversationId: string;
  openOption: string;
  setOpenOption: React.Dispatch<SetStateAction<string>>;
};

const ChatBubble = ({
  message,
  userSessionId,
  conversationId,
  openOption,
  setOpenOption,
}: ChatBubbleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsEditing(false);
    setOpenOption((prev) => (prev === message.id ? "" : message.id));
  };

  const handleEditing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSending) return;

    const formData = new FormData(e.currentTarget);
    const content = formData.get("message")?.toString().trim();

    try {
      setIsSending(true);

      const res = await fetch(`/api/socket/messages/${message.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          messageId: message.id,
          conversationId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to edit message, please try again");
      }
    } catch (err) {
      console.log(err);
      if (err instanceof Error) setError(err);
    } finally {
      setIsSending(false);
      setIsEditing(false);
      setOpenOption("");
    }
  };

  const handleDeleteMessage = async () => {
    try {
      setIsSending(true);

      const res = await fetch(`/api/socket/messages/${message.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: message.id,
          conversationId,
        }),
      });

      if (!res.ok) throw new Error("Failed to delete message");
    } catch (err) {
      if (err instanceof Error) setError(err);
      console.log(err);
    } finally {
      setIsSending(false);
      setOpenOption("");
    }
  };

  return (
    <Bubble
      variant="secondary"
      align={`${userSessionId === message.senderId ? "end" : "start"}`}
      className="relative h-fit"
    >
      {message.fileUrl.map((file) => (
        <BubbleContent
          key={file}
          className="min-w-50 min-h-50 relative"
          onContextMenu={handleContextMenu}
        >
          {file.includes("image/") ? (
            <Image src={file} alt={file} fill />
          ) : (
            <video controls>
              <source src={file} />
            </video>
          )}
          <p
            className={`text-chart-2 text-xs absolute bottom-2 ${userSessionId === message.senderId ? "right-4" : "left-4"}`}
          >
            {formatMessageDate(message.updatedAt)}
          </p>
        </BubbleContent>
      ))}
      <BubbleContent onContextMenu={handleContextMenu}>
        {isEditing ? (
          <form onSubmit={handleEditing} className="relative">
            <Textarea
              name="message"
              placeholder="Type a message..."
              rows={1}
              defaultValue={message.content}
              className="pr-12"
              style={{
                minHeight: "2.5rem",
                maxHeight: "7rem",
                resize: "none",
                height: "auto",
              }}
            ></Textarea>
            {error && <p className="text-xs text-red-400">{error.message}</p>}
            <div className="absolute top-[50%] right-0 translate-y-[-50%]">
              <Button type="submit" variant="ghost" className="cursor-pointer">
                {isSending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Send />
                )}
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-foreground">{message.content}</p>
        )}
        <span className="text-xs text-chart-2">
          {formatMessageDate(message.updatedAt)}
        </span>
      </BubbleContent>

      {userSessionId === message.senderId &&
        openOption === message.id &&
        !isEditing && (
          <BubbleContent className="w-32 absolute -bottom-26 grid gap-2 z-1">
            <Button
              className="w-full p-4 flex items-center gap-2 text-white cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <Pencil />
              Edit
            </Button>

            <Button
              variant="destructive"
              className="w-full p-4 flex items-center gap-2 cursor-pointer"
              onClick={handleDeleteMessage}
            >
              <Trash />
              Delete
            </Button>
          </BubbleContent>
        )}
    </Bubble>
  );
};

export default ChatBubble;
