"use client";

import Image from "next/image";
import { useActionState, useState, useRef, useTransition } from "react";
import {
  Pencil,
  Trash,
  ArrowLeftCircle,
  ImageUp,
  Video,
  Send,
  LoaderCircle,
} from "lucide-react";

import { type FeedsProps } from "@/app/(home)/@feed/page";
import { deleteFeed, updateFeed } from "@actions/feed";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
} from "@components/ui/field";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import FeedCarousel from "@components/feed/feedCarousel";
import FeedDescription from "@components/feed/feedDescription";
import LikeFeed from "./likeFeed";
import CommentFeed from "./comment/commentLists";

type UpdateFeedProps = {
  feed: FeedsProps;
  isAuthorized: boolean;
  session?: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
    description: string;
    username: string;
  };
};

function UpdateFeed({ feed, isAuthorized, session }: UpdateFeedProps) {
  const [state, dispatchAction, isLoading] = useActionState(updateFeed, {
    status: 200,
    message: "",
    data: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteImages, setDeleteImages] = useState<string[]>([]);
  const [deleteVideos, setDeleteVideos] = useState<string[]>([]);
  const [images, setImages] = useState<(File | string)[]>([...feed.images]);
  const [videos, setVideos] = useState<(File | string)[]>([...feed.videos]);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const addImageRef = useRef<HTMLInputElement>(null);
  const addVideoRef = useRef<HTMLInputElement>(null);
  const [_, startTransition] = useTransition();
  const [updating, setUpdating] = useState(false);

  const handleDeleteImage = (image: string) => {
    setDeleteImages((prev) => {
      return [...prev, image];
    });
  };

  const handleDeleteVideo = (video: string) => {
    setDeleteVideos((prev) => {
      return [...prev, video];
    });
  };

  const handleAddNewImage = () => {
    addImageRef.current?.click();
  };

  const handleAddNewVideo = () => {
    addVideoRef.current?.click();
  };

  const uploadCloudinaryWithSignature = async (file: File) => {
    const signatureResponse = await fetch("/api/cloudinary/signature/feeds", {
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

  const handleUpdateFeed = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || updating) return;

    let uploadImages;
    let uploadVideos;

    const formData = new FormData(e.currentTarget);
    const maxImageSize = 10 * 1024 * 1024;
    const maxVideoSize = 100 * 1024 * 1024;

    try {
      setUpdating(true);

      if (images.length > 0) {
        images.forEach((file) => {
          if (file instanceof File) {
            if (file.type.startsWith("image/")) {
              if (file.size > maxImageSize) {
                throw new Error("Maximum Image Size is 10MB");
              }
            }
          }
        });
      }

      if (videos.length > 0) {
        videos.forEach((file) => {
          if (file instanceof File) {
            if (file.type.startsWith("video/")) {
              if (file.size > maxVideoSize) {
                throw new Error("Maximum Video Size is 100MB");
              }
            }
          }
        });
      }

      uploadImages = await Promise.all(
        images
          .filter((file) => file instanceof File)
          .map((file) => uploadCloudinaryWithSignature(file)),
      );

      uploadVideos = await Promise.all(
        videos
          .filter((file) => file instanceof File)
          .map((file) => uploadCloudinaryWithSignature(file)),
      );

      formData.set("images", JSON.stringify(uploadImages) ?? []);
      formData.set("videos", JSON.stringify(uploadVideos) ?? []);
      formData.set("deletedImages", JSON.stringify(deleteImages));
      formData.set("deletedVideos", JSON.stringify(deleteVideos));

      startTransition(() => dispatchAction(formData));
    } catch (err) {
      console.log(err);
    } finally {
      setUpdating(false);
    }
  };

  if (isEditing)
    return (
      <>
        {isAuthorized && (
          <section className="flex gap-2">
            <Button
              variant="ghost"
              className={`${isLoading || updating ? "cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => setIsEditing(false)}
              disabled={isLoading || updating}
            >
              <ArrowLeftCircle />
            </Button>
          </section>
        )}
        <form onSubmit={handleUpdateFeed}>
          <Field>
            <FieldContent className="flex flex-col gap-4">
              {images.length > 0 && (
                <FieldGroup className="flex flex-row flex-wrap justify-center md:justify-start">
                  {images
                    .filter((image) => {
                      if (typeof image === "string")
                        return !deleteImages.includes(image);
                      else return !deleteImages.includes(image.name);
                    })
                    .map((image) => (
                      <div
                        key={typeof image === "string" ? image : image.name}
                        className="w-30 aspect-square relative"
                      >
                        <Image
                          src={
                            typeof image === "string"
                              ? image
                              : URL.createObjectURL(image)
                          }
                          alt={typeof image === "string" ? image : image.name}
                          fill
                          sizes="(min-width: 768px) 50%, 100%"
                        />
                        <Button
                          variant="destructive"
                          className={`absolute bottom-0 right-0 ${isLoading || updating ? "cursor-not-allowed" : "cursor-pointer"}`}
                          onClick={() =>
                            handleDeleteImage(
                              typeof image === "string" ? image : image.name,
                            )
                          }
                          disabled={isLoading || updating}
                        >
                          <Trash />
                        </Button>
                      </div>
                    ))}
                </FieldGroup>
              )}

              {videos.length > 0 && (
                <FieldGroup className="flex flex-row flex-wrap justify-center md:justify-start">
                  {videos
                    .filter((video) => {
                      if (typeof video === "string")
                        return !deleteVideos.includes(video);
                      else return !deleteVideos.includes(video.name);
                    })
                    .map((video) => (
                      <div
                        key={typeof video === "string" ? video : video.name}
                        className="w-fit relative"
                      >
                        <video controls muted loop className="w-50">
                          <source
                            src={
                              typeof video === "string"
                                ? video
                                : URL.createObjectURL(video)
                            }
                          />
                        </video>

                        <Button
                          variant="destructive"
                          className={`absolute bottom-0 right-0 ${isLoading || updating ? "cursor-not-allowed" : "cursor-pointer"}`}
                          onClick={() =>
                            handleDeleteVideo(
                              typeof video === "string" ? video : video.name,
                            )
                          }
                          disabled={isLoading || updating}
                        >
                          <Trash />
                        </Button>
                      </div>
                    ))}
                </FieldGroup>
              )}

              <Textarea
                name="description"
                defaultValue={feed.description}
                ref={descriptionRef}
                disabled={isLoading || updating}
                className={`${(isLoading || updating) && "cursor-not-allowed"}`}
              />
              {state.status !== 200 && <FieldError>{state.message}</FieldError>}
              <input type="hidden" name="postId" value={feed.id} />

              <FieldGroup className="flex flex-row justify-between">
                <FieldGroup className="flex flex-row gap-2">
                  <Button
                    variant="outline"
                    className={
                      isLoading || updating
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }
                    onClick={handleAddNewImage}
                    disabled={isLoading || updating}
                  >
                    <input
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      ref={addImageRef}
                      onChange={handleChangePreviewFile}
                      style={{ display: "none" }}
                    />
                    <ImageUp />
                  </Button>
                  <Button
                    variant="outline"
                    className={
                      isLoading || updating
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }
                    onClick={handleAddNewVideo}
                    disabled={isLoading || updating}
                  >
                    <input
                      type="file"
                      name="videos"
                      accept="video/*"
                      multiple
                      ref={addVideoRef}
                      onChange={handleChangePreviewFile}
                      style={{ display: "none" }}
                    />
                    <Video />
                  </Button>
                </FieldGroup>
                <Button
                  type="submit"
                  variant="outline"
                  className={
                    isLoading || updating
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }
                  disabled={isLoading || updating}
                >
                  {isLoading || updating ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Send />
                  )}
                </Button>
              </FieldGroup>
            </FieldContent>
          </Field>
        </form>
      </>
    );
  else
    return (
      <>
        {isAuthorized && (
          <section className="flex gap-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <Pencil />
            </Button>
            <form action={deleteFeed}>
              <input type="hidden" name="feedId" value={feed.id} />
              <Button
                type="submit"
                variant="destructive"
                className="cursor-pointer"
              >
                <Trash />
              </Button>
            </form>
          </section>
        )}

        {(feed.images.length > 0 || feed.videos.length > 0) && (
          <section className="place-items-center">
            <div className="w-[60%]">
              <FeedCarousel images={feed.images} videos={feed.videos} />
            </div>
          </section>
        )}
        <FeedDescription
          description={feed.description}
          createdAt={feed.createdAt}
        />

        <section className="flex items-center gap-2">
          <LikeFeed feed={feed} session={session} />
          <CommentFeed feed={feed} username={session?.username} />
        </section>
      </>
    );
}

export default UpdateFeed;
