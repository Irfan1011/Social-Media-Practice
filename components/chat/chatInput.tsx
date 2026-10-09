"use client";

import { Send } from "lucide-react";

import { Field, FieldContent } from "@components/ui/field";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";

type ChatInputProps = {
  conversationId: string;
};

const ChatInput = ({ conversationId }: ChatInputProps) => {
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const content = formData.get("message")?.toString().trim();
    const fileUrl = formData
      .getAll("fileUrl")
      .map(String)
      .filter((url) => url.trim() !== "");
    const conversationId = formData.get("conversationId")?.toString();

    try {
      await fetch("/api/socket/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          fileUrl,
          conversationId,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <Field>
        <FieldContent className="flex flex-row justify-between items-center">
          <Textarea
            name="message"
            placeholder="Type a message..."
            rows={1}
            style={{
              minHeight: "2.5rem",
              maxHeight: "7rem",
              resize: "none",
              height: "auto",
            }}
          ></Textarea>
          <input type="hidden" name="fileUrl" value="" />
          <input type="hidden" name="conversationId" value={conversationId} />
          <Button type="submit" variant="outline" className="cursor-pointer">
            <Send />
          </Button>
        </FieldContent>
      </Field>
    </form>
  );
};

export default ChatInput;
