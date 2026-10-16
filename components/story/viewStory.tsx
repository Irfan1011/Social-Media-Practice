"use client";

import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  X,
  CircleArrowLeft,
  CircleArrowRight,
  EllipsisVertical,
  Trash,
} from "lucide-react";

import type { Story, User } from "@/generated/prisma/client";
import { deleteStory } from "@actions/story";
import { shortDateTimeFormatter } from "@/lib/utils";
import { Button } from "@components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Card, CardContent } from "@components/ui/card";

type StoryWithUserProps = Story & {
  user: User;
};

type ViewStoryProps = {
  stories: StoryWithUserProps[];
  isViewing: boolean;
  storyIndex: number;
  sessionId: string;
  setIsViewing: React.Dispatch<React.SetStateAction<boolean>>;
  onHandleNextStory: () => void;
  onHandlePrevStory: () => void;
};

const ImageDuration = 5000;
const ViewStory = ({
  stories,
  isViewing,
  storyIndex,
  sessionId,
  setIsViewing,
  onHandleNextStory,
  onHandlePrevStory,
}: ViewStoryProps) => {
  const [progress, setProgress] = useState(ImageDuration);
  const [duration, setDuration] = useState(ImageDuration);
  const [openStoryOption, setOpenStoryOption] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isViewing]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0 || !isViewing) {
          clearInterval(timer);
          return 0;
        }
        return prev - 50;
      });
    }, 50);

    return () => {
      clearInterval(timer);
    };
  }, [setProgress, isViewing]);

  useEffect(() => {
    if (progress <= 0) setIsViewing(false);
  }, [progress]);

  const handleStartTimer = (duration: number) => {
    setProgress(duration);
    setDuration(duration);
  };

  const handleStoryOption = () => {
    setOpenStoryOption((prev) => !prev);
  };

  return (
    <li className="w-full h-full absolute top-0 left-0 z-2 ">
      <div className="w-full h-full bg-popover/25 backdrop-blur-xs"></div>
      <section className="flex flex-col gap-12 p-4 w-full h-full place-items-center absolute top-0 left-0">
        <Button
          variant="outline"
          className="self-end cursor-pointer"
          onClick={() => setIsViewing(false)}
        >
          <X />
        </Button>
        {stories.length > 0 && (
          <div className="min-w-50 max-w-full h-[80vh] aspect-square place-content-center relative">
            <article
              className={`w-full h-fit shadow-stone-500 shadow-[0_0_4px_1px] rounded-2xl place-content-center relative overflow-clip ${stories[storyIndex].video ?? "min-h-[80vh]"}`}
            >
              <div
                className={`z-1 absolute top-0 left-0 bg-primary h-1`}
                style={{ width: `${(progress / duration) * 100}%` }}
              ></div>
              <Link
                href={`/${stories[storyIndex].user.username}`}
                className="text-black bg-popover-foreground/25 p-2 rounded-sm flex items-center gap-2 z-1 absolute top-2 left-2"
              >
                <Avatar size="lg" className="scale-100 ">
                  <AvatarImage
                    src={stories[storyIndex].user.image || ""}
                    alt={stories[storyIndex].user.name}
                  />
                  <AvatarFallback>
                    {stories[storyIndex].user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <article>
                  <span className="font-bold">
                    @{stories[storyIndex].user.username}
                  </span>
                  <p className="font-light text-xs">
                    {
                      shortDateTimeFormatter
                        .format(stories[storyIndex].createdAt)
                        .split(",")[1]
                    }
                  </p>
                </article>
              </Link>

              {stories[storyIndex].userId === sessionId && (
                <section className="z-1 absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    className="rounded-full text-primary cursor-pointer"
                    onClick={handleStoryOption}
                  >
                    <EllipsisVertical />
                  </Button>

                  <Card
                    className={`bg-secondary absolute top-0 right-12 ${openStoryOption ? "block" : "hidden"}`}
                  >
                    <CardContent className="relative">
                      <Form action={deleteStory}>
                        <input
                          type="hidden"
                          name="storyId"
                          value={stories[storyIndex].id}
                        />
                        <Button
                          type="submit"
                          variant="destructive"
                          className="cursor-pointer"
                        >
                          <Trash />
                        </Button>
                      </Form>
                    </CardContent>
                  </Card>
                  <div
                    className={`w-4 h-4 border-12 border-l-secondary border-r-transparent border-t-transparent border-b-transparent absolute top-2 right-7 ${openStoryOption ? "block" : "hidden"}`}
                  ></div>
                </section>
              )}

              {stories[storyIndex].image && (
                <Image
                  src={stories[storyIndex].image}
                  alt={stories[storyIndex].image}
                  fill
                  sizes="(min-width: 768px) 50%, 100%"
                  style={{ objectFit: "cover" }}
                  onLoad={() => handleStartTimer(ImageDuration)}
                />
              )}

              {stories[storyIndex].video && (
                <video
                  autoPlay
                  playsInline
                  onLoadedMetadata={(e) => {
                    const videoDuration = e.currentTarget.duration * 1000;
                    handleStartTimer(videoDuration);
                  }}
                  onEnded={() => setIsViewing(false)}
                >
                  <source src={stories[storyIndex].video} />
                </video>
              )}
            </article>

            {stories.length - 1 > 0 && storyIndex > 0 && (
              <Button
                variant="ghost"
                onClick={() => {
                  onHandlePrevStory();
                  setOpenStoryOption(false);
                }}
                className="absolute top-[50%] -left-10 rounded-full cursor-pointer"
              >
                <CircleArrowLeft className="text-primary scale-150" />
              </Button>
            )}
            {stories.length - 1 > 0 && storyIndex < stories.length - 1 && (
              <Button
                variant="ghost"
                onClick={() => {
                  onHandleNextStory();
                  setOpenStoryOption(false);
                }}
                className="absolute top-[50%] -right-10 rounded-full cursor-pointer"
              >
                <CircleArrowRight className="text-primary scale-150" />
              </Button>
            )}
          </div>
        )}
      </section>
    </li>
  );
};

export default ViewStory;
