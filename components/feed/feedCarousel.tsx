"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

import { Button } from "@components/ui/button";

type MediaProps = {
  type: "image" | "video";
  url: string;
};

type FeedCarouselProps = {
  images?: string[];
  videos?: string[];
};

function FeedCarousel({ images = [], videos = [] }: FeedCarouselProps) {
  const [feedIndex, setFeedIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const feed = feedRef.current;

    if (!video || !feed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play();
        else video.pause();
      },
      { threshold: 1 },
    );

    observer.observe(feed);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [feedIndex]);

  const media: MediaProps[] = [
    ...images.map((url) => ({ type: "image" as const, url })),
    ...videos.map((url) => ({ type: "video" as const, url })),
  ];

  const handleNextCarousel = () => {
    setFeedIndex((prev) => {
      if (prev === media.length - 1) return 0;

      return prev + 1;
    });
  };

  const handlePrevCarousel = () => {
    setFeedIndex((prev) => {
      if (prev <= 0) return media.length - 1;
      return prev - 1;
    });
  };

  const handleSelectImage = (selectedIndex: number) => {
    setFeedIndex(selectedIndex);
  };

  return (
    <>
      <div
        className="flex justify-center w-full aspect-16/8 relative"
        ref={feedRef}
      >
        {media[feedIndex].type === "image" && (
          <Image
            src={media[feedIndex].url}
            alt={media[feedIndex].url}
            fill
            sizes="(min-width: 768px) 50%, 100%"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        )}
        {media[feedIndex].type === "video" && (
          <video key={media[feedIndex].url} ref={videoRef} controls muted loop>
            <source src={media[feedIndex].url} />
          </video>
        )}
        {media.length > 1 && (
          <>
            <Button
              variant="ghost"
              onClick={handlePrevCarousel}
              className="group h-full border-0 rounded-none cursor-pointer absolute left-0"
            >
              <CircleArrowLeft className="invisible group-hover:visible text-primary min-w-7 min-h-7" />
            </Button>
            <Button
              variant="ghost"
              onClick={handleNextCarousel}
              className="group h-full border-0 rounded-none cursor-pointer absolute right-0"
            >
              <CircleArrowRight className="invisible group-hover:visible text-primary min-w-7 min-h-7" />
            </Button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <ul className="flex justify-center gap-2">
          {media.map((image, index) => (
            <li key={image.url}>
              <button
                className={`${feedIndex == index ? "bg-stone-600" : "bg-stone-300"} w-2 aspect-square rounded-full cursor-pointer`}
                onClick={() => handleSelectImage(index)}
              ></button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default FeedCarousel;
