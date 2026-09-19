"use client";

import Image from "next/image";
import React, {
  startTransition,
  useActionState,
  useRef,
  useState,
} from "react";
import { LoaderCircle, Plus, Send } from "lucide-react";

import { addStory } from "@actions/story";
import { Button } from "@components/ui/button";

function AddStory() {
  const [state, dispatchAction, isPending] = useActionState(addStory, null);
  const [selectFile, setSelectFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = () => {
    inputRef.current?.click();
  };

  const handleOnChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectFile(null);
      return;
    }

    setSelectFile(file);

    e.target.value = "";
  };

  const uploadCloudinaryWithSignature = async (file: File) => {
    const signatureResponse = await fetch("/api/cloudinary/signatureStory", {
      method: "POST",
    });

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

  const handleAddStory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPending || isLoading || !selectFile) return;

    const maxImageSize = 10 * 1024 * 1024;
    const maxVideoSize = 100 * 1024 * 1024;

    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      let uploadedFile;

      if (selectFile.type.startsWith("image/")) {
        if (selectFile.size > maxImageSize) {
          throw new Error("Maximum Image Size is 10MB");
        }
      }

      if (selectFile.type.startsWith("video/")) {
        if (selectFile.size > maxVideoSize) {
          throw new Error("Maximum Video Size is 100MB");
        }
      }

      uploadedFile = await uploadCloudinaryWithSignature(selectFile);

      if (selectFile.type.startsWith("image/")) {
        formData.set("image", JSON.stringify(uploadedFile));
      }

      if (selectFile.type.startsWith("video/")) {
        formData.set("video", JSON.stringify(uploadedFile));
      }

      startTransition(() => {
        dispatchAction(formData);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something Went Wrong");
    } finally {
      setSelectFile(null);
      setIsLoading(false);
      setError("");
    }
  };

  return (
    <form
      onSubmit={handleAddStory}
      className="flex flex-col items-center justify-start h-35 relative"
    >
      <input
        type="file"
        name="file"
        ref={inputRef}
        onChange={handleOnChangeFile}
        style={{ display: "none" }}
        accept="image/*,video/*"
      />
      <Button
        variant="outline"
        size="lg"
        className="rounded-full cursor-pointer min-w-25 min-h-25 overflow-clip relative"
        onClick={handleSelectFile}
        disabled={isPending || isLoading}
      >
        {selectFile?.type.startsWith("image/") && (
          <Image
            src={URL.createObjectURL(selectFile)}
            alt={selectFile.name}
            fill
          />
        )}

        {selectFile?.type.startsWith("video/") && (
          <video autoPlay muted loop width={80} height={80}>
            <source src={URL.createObjectURL(selectFile)} />
          </video>
        )}

        {!selectFile && <Plus />}
      </Button>

      <Button
        type="submit"
        variant="ghost"
        className={`absolute bottom-0 ${isPending || isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
        disabled={isPending || isLoading}
      >
        {isPending || isLoading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <span className="flex place-items-center gap-2">
            <Send />
            Send
          </span>
        )}
      </Button>
      {(state?.status !== 200 || error) && (
        <span>{state?.message || error}</span>
      )}
    </form>
  );
}

export default AddStory;
