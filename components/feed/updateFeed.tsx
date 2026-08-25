"use client";

import Image from "next/image";
import { useState, useRef, ChangeEvent, useActionState } from "react";
import { Pencil, Trash, ArrowLeftCircle } from "lucide-react";

import { deleteFeed, updateFeed } from "@actions/feed";
import { Button } from "@components/ui/button";
import FeedDescription from "@components/feed/feedDescription";
import { Field, FieldContent, FieldError } from "@components/ui/field";
import FeedCarousel from "./feedCarousel";

type UpdateFeedProps = {
  feed: {
    _count: {
      like: number;
      comment: number;
    };
  } & {
    id: string;
    images: string[];
    videos: string[];
    description: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  isAuthorized: boolean;
};

function UpdateFeed({ feed, isAuthorized }: UpdateFeedProps) {
  const [state, dispatchAction, isLoading] = useActionState(updateFeed, {
    status: 200,
    message: "",
    data: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<File[]>([]);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleSelectNewImage = () => {
    imageRef.current?.click();
  };

  const handlePreviewImage = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) {
      return;
    }
    setPreviewImage([]);

    const newFile = Array.from(files);

    setPreviewImage((prev) => [...prev, ...newFile]);
  };

  return (
    <>
      {isEditing ? (
        <Field>
          <FieldContent>
            <button
              type="button"
              className="w-fit rounded-full cursor-pointer hover:bg-secondary"
              onClick={() => setIsEditing(false)}
            >
              <ArrowLeftCircle />
            </button>
            <form action={dispatchAction} className="flex flex-col gap-4">
              {feed.images.length > 0 && (
                <div className="flex flex-col items-center">
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    ref={imageRef}
                    onChange={handlePreviewImage}
                  />
                  {previewImage.length > 0 ? (
                    <div className="flex self-start w-50 gap-2">
                      {previewImage.map((img) => (
                        <Image
                          key={img.name}
                          src={URL.createObjectURL(img)}
                          alt={img.name}
                          width={400}
                          height={400}
                          unoptimized
                          className="cursor-pointer"
                          onClick={handleSelectNewImage}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="w-[50%]">
                      <FeedCarousel
                        images={feed.images}
                        onSelectImages={handleSelectNewImage}
                      />
                    </div>
                  )}
                </div>
              )}
              <textarea
                name="description"
                defaultValue={feed.description}
                ref={descriptionRef}
                rows={4}
                className="border rounded-md p-4 mt-4 w-full"
              />
              <input type="hidden" name="postId" value={feed.id} />
              {state.status !== 200 && <FieldError>{state.message}</FieldError>}
              <Button
                type="submit"
                variant="outline"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </form>
          </FieldContent>
        </Field>
      ) : (
        <article>
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

          {feed.images.length > 0 && (
            <section className="place-items-center">
              <div className="w-[60%]">
                <FeedCarousel images={feed.images} />
              </div>
            </section>
          )}
          <FeedDescription description={feed.description} />
        </article>
      )}
    </>
  );
}

export default UpdateFeed;
