"use client";

import Link from "next/link";
import { useState } from "react";

import type { Story, User } from "@/generated/prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import ViewStory from "./viewStory";

type StoryWithUserProps = Story & {
  user: User;
};

type StoriesProps = {
  stories: StoryWithUserProps[];
  sessionId: string;
};

function Stories({ stories, sessionId }: StoriesProps) {
  const [isViewing, setIsViewing] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);

  const handleViewStory = (index: number) => {
    setCurrIndex(index);
    setIsViewing((prev) => !prev);
  };

  const handlePrevStory = () => {
    setCurrIndex((prev) => {
      if (prev <= 0) return 0;
      return (prev -= 1);
    });
  };

  const handleNextStory = () => {
    setCurrIndex((prev) => {
      if (prev >= stories.length - 1) return stories.length - 1;
      return (prev += 1);
    });
  };

  if (stories.length > 0 && isViewing) {
    return (
      <ViewStory
        stories={stories}
        isViewing={isViewing}
        storyIndex={currIndex}
        sessionId={sessionId}
        setIsViewing={setIsViewing}
        onHandleNextStory={handleNextStory}
        onHandlePrevStory={handlePrevStory}
      />
    );
  }

  return (
    stories.length > 0 &&
    !isViewing &&
    stories.map((story, index) => (
      <li key={story.id} className="flex flex-col items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full cursor-pointer w-25 h-25 relative"
          onClick={() => handleViewStory(index)}
        >
          <Avatar size="lg" className="scale-250">
            <AvatarImage src={story.user.image || ""} alt={story.user.name} />
            <AvatarFallback>
              {story.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
        <Link href={`/${story.user.username}`}>
          <p>@{story.user.username}</p>
        </Link>
      </li>
    ))
  );
}

export default Stories;
