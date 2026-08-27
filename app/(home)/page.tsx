"use client";

import Image from "next/image";
import { useActionState, useRef, useState, useTransition } from "react";
import { ImageUp, Video, Send, LoaderCircle } from "lucide-react";

import { addFeed } from "@actions/feed";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Button } from "@components/ui/button";

function Page() {
  const [state, dispatchAction, isLoading] = useActionState(addFeed, {
    status: 200,
    message: "",
    data: [],
  });
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [_, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const handleSelectImage = () => {
    imageRef.current?.click();
  };

  const handleSelectVideo = () => {
    videoRef.current?.click();
  };

  const handleChangePreviewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) {
      return;
    }

    const newFiles = Array.from(files);

    const newImages = newFiles.filter((file) => file.type.startsWith("image/"));
    const newVideos = newFiles.filter((file) => file.type.startsWith("video/"));

    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages]);
    }

    if (newVideos.length > 0) {
      setVideos((prev) => [...prev, ...newVideos]);
    }

    e.target.value = "";
  };

  const uploadCloudinaryWithSignature = async (file: File) => {
    const signatureResponse = await fetch("/api/cloudinary/signature", {
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

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || uploading) return;

    const maxImageSize = 10 * 1024 * 1024;
    const maxVideoSize = 100 * 1024 * 1024;

    try {
      setUploading(true);

      const formData = new FormData(e.currentTarget);
      let uploadedImages;
      let uploadedVideos;

      if (images.length > 0) {
        images.forEach((file) => {
          if (file.type.startsWith("image/")) {
            if (file.size > maxImageSize) {
              throw new Error("Maximum Image Size is 10MB");
            }
          }
        });
      }

      if (videos.length > 0) {
        videos.forEach((file) => {
          if (file.type.startsWith("video/")) {
            if (file.size > maxVideoSize) {
              throw new Error("Maximum Video Size is 100MB");
            }
          }
        });
      }

      uploadedImages = await Promise.all(
        images.map((file) => uploadCloudinaryWithSignature(file)),
      );
      uploadedVideos = await Promise.all(
        videos.map((file) => uploadCloudinaryWithSignature(file)),
      );

      formData.set("images", JSON.stringify(uploadedImages) ?? []);
      formData.set("videos", JSON.stringify(uploadedVideos) ?? []);

      startTransition(() => {
        dispatchAction(formData);
      });

      setImages([]);
      setVideos([]);
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldContent>
            <form onSubmit={handleOnSubmit}>
              {/* POST DESCRIPTION */}
              <textarea
                name="description"
                placeholder="What's In Your Mind?"
                rows={4}
                className={`border rounded-md p-4 w-full ${(isLoading || uploading) && "cursor-not-allowed"}`}
                disabled={isLoading || uploading}
              />
              {state.status !== 200 && (
                <FieldError className="px-4">{state.message}</FieldError>
              )}

              {/* BUTTON SELECT IMAGE OR VIDEO */}
              <FieldGroup className="flex flex-row justify-between">
                <FieldGroup className="flex-row gap-4 w-full">
                  <Button
                    variant="outline"
                    className={
                      isLoading || uploading
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }
                    onClick={handleSelectImage}
                    disabled={isLoading || uploading}
                  >
                    <ImageUp />
                  </Button>
                  <Button
                    variant="outline"
                    className={
                      isLoading || uploading
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }
                    onClick={handleSelectVideo}
                    disabled={isLoading || uploading}
                  >
                    <Video />
                  </Button>
                </FieldGroup>
                <Button
                  type="submit"
                  variant="ghost"
                  className={
                    isLoading || uploading
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }
                  disabled={isLoading || uploading}
                >
                  {isLoading || uploading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Send />
                  )}
                </Button>
              </FieldGroup>

              {/* IMAGE AND VIDEO PREVIEW */}
              <FieldGroup>
                <input
                  type="file"
                  name="images"
                  ref={imageRef}
                  onChange={handleChangePreviewFile}
                  style={{ display: "none" }}
                  accept="image/*"
                  multiple
                />
                <input
                  type="file"
                  name="videos"
                  size={1e8}
                  ref={videoRef}
                  onChange={handleChangePreviewFile}
                  style={{ display: "none" }}
                  accept="video/*"
                  multiple
                />
                {images && (
                  <div className="flex gap-4 flex-wrap">
                    {images.map((img) => (
                      <Image
                        key={img.name}
                        src={URL.createObjectURL(img)}
                        alt={img.name}
                        width={150}
                        height={150}
                        className="my-4"
                      />
                    ))}
                  </div>
                )}
                {videos && (
                  <div className="flex gap-4 flex-wrap">
                    {videos.map((video) => (
                      <video
                        key={video.name}
                        id={video.name}
                        width={250}
                        controls
                        loop
                      >
                        <source
                          src={URL.createObjectURL(video)}
                          type={video.type}
                        />
                      </video>
                    ))}
                  </div>
                )}
              </FieldGroup>
            </form>
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  );
}

export default Page;
