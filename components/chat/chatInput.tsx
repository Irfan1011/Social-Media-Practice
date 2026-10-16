"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LoaderCircle, Plus, Send, X } from "lucide-react";

import { Field, FieldContent, FieldGroup } from "@components/ui/field";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";

type ChatInputProps = {
  conversationId: string;
};

const ChatInput = ({ conversationId }: ChatInputProps) => {
  const [selectFile, setSelectFile] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSelectFile = () => {
    fileRef.current?.click();
  };

  const handleRemoveFile = (file: string) => {
    if (isSending) return;

    setSelectFile((prev) =>
      prev.filter((selectedFile) => {
        if (typeof selectedFile === "string")
          return !file.includes(selectedFile);
        else return !file.includes(selectedFile.name);
      }),
    );
  };

  const handleOnChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) {
      return;
    }

    const newFiles = Array.from(files);
    const newImages = newFiles.filter((file) => file.type.startsWith("image/"));
    const newVideos = newFiles.filter((file) => file.type.startsWith("video/"));

    setSelectFile((prev) => [...prev, ...newImages, ...newVideos]);

    e.target.value = "";
  };

  const uploadCloudinaryWithSignature = async (file: File) => {
    const signatureResponse = await fetch(
      "/api/cloudinary/signature/messages",
      {
        method: "POST",
      },
    );

    if (!signatureResponse.ok) {
      throw new Error("Failed to get Cloudinary signature");
    }

    const { signature, timestamp, folder, cloudName, apiKey } =
      await signatureResponse.json();

    const resourceType = file.type.startsWith("video/") ? "video" : "image";

    const formData = new FormData();

    formData.append("file", file);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("api_key", apiKey);
    formData.append("folder", folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to upload file to Cloudinary");
    }

    const data = await response.json();

    return data;
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSending) return;

    const formData = new FormData(e.currentTarget);

    const content = formData.get("message")?.toString().trim();
    const conversationId = formData.get("conversationId")?.toString();

    try {
      setIsSending(true);
      if (selectFile.length > 0) {
        const maxImageSize = 10 * 1024 * 1024;
        const maxVideoSize = 100 * 1024 * 1024;

        selectFile.forEach((file) => {
          if (file.type.startsWith("image/")) {
            if (file.size > maxImageSize) {
              throw new Error("Maximum Image Size is 10MB");
            }
          }
          if (file.type.startsWith("video/")) {
            if (file.size > maxVideoSize) {
              throw new Error("Maximum Video Size is 100MB");
            }
          }
        });
      }

      const fileUrl = await Promise.all(
        selectFile
          .filter((file) => file instanceof File)
          .map((file) => uploadCloudinaryWithSignature(file)),
      );

      const res = await fetch("/api/socket/messages", {
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

      if (!res.ok) {
        throw new Error("Failed to send message, please try again");
      }
    } catch (err) {
      if (err instanceof Error) setError(err);
      console.log(err);
    } finally {
      if (messageRef.current) messageRef.current.value = "";
      setSelectFile([]);
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <Field>
        <FieldContent className="flex flex-col">
          {error && <p className="text-red-400">{error.message}</p>}
          {selectFile.length > 0 && (
            <FieldGroup className="flex flex-row w-full p-4 bg-primary-foreground">
              {selectFile.map((selectedFile) => (
                <div
                  key={selectedFile.name}
                  className={`w-25 h-25 overflow-clip relative ${isSending ? "hover:cursor-not-allowed" : "hover:cursor-pointer "}`}
                  onClick={() => handleRemoveFile(selectedFile.name)}
                >
                  {selectedFile.type.startsWith("image/") && (
                    <Image
                      src={URL.createObjectURL(selectedFile)}
                      alt={selectedFile.name}
                      fill
                      sizes="(min-width: 768px) 50%, 100%"
                    />
                  )}
                  {selectedFile?.type.startsWith("video/") && (
                    <video autoPlay muted loop width={100} height={100}>
                      <source src={URL.createObjectURL(selectedFile)} />
                    </video>
                  )}
                  <div className="absolute top-1 right-1 bg-primary rounded-full">
                    <X className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </FieldGroup>
          )}
          <FieldGroup className="flex flex-row justify-between items-center gap-2">
            <input
              type="file"
              name="fileUrl"
              ref={fileRef}
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleOnChangeFile}
            />
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleSelectFile}
              disabled={isSending}
            >
              <Plus />
            </Button>
            <Textarea
              name="message"
              placeholder="Type a message..."
              rows={1}
              ref={messageRef}
              disabled={isSending}
              style={{
                minHeight: "2.5rem",
                maxHeight: "7rem",
                resize: "none",
                height: "auto",
              }}
            ></Textarea>
            <input type="hidden" name="conversationId" value={conversationId} />
            <Button
              type="submit"
              variant="outline"
              className="cursor-pointer"
              disabled={isSending}
            >
              {isSending ? <LoaderCircle className="animate-spin" /> : <Send />}
            </Button>
          </FieldGroup>
        </FieldContent>
      </Field>
    </form>
  );
};

export default ChatInput;
