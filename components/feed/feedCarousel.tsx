"use client";

import Image from "next/image";
import { useState } from "react";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

import { Button } from "@components/ui/button";

type FeedCarouselProps = {
  images: string[];
  onSelectImages?: () => void;
};

function FeedCarousel({ images, onSelectImages }: FeedCarouselProps) {
  const [imageIndex, setImageIndex] = useState(0);

  const handleNextCarousel = () => {
    setImageIndex((prev) => {
      if (prev === images.length - 1) return 0;
      return prev + 1;
    });
  };

  const handlePrevCarousel = () => {
    setImageIndex((prev) => {
      if (prev <= 0) return images.length - 1;
      return prev - 1;
    });
  };

  const handleSelectImage = (selectedIndex: number) => {
    setImageIndex(selectedIndex);
  };

  return (
    <>
      <div className="flex justify-center w-full aspect-16/8 relative">
        {images.length > 0 && (
          <Image
            src={images[imageIndex]}
            alt={images[imageIndex]}
            fill
            objectFit="cover"
            objectPosition="center"
            unoptimized
            className={`${onSelectImages && "cursor-pointer"}`}
            onClick={onSelectImages}
          />
        )}
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
      </div>
      <ul className="flex justify-center gap-2">
        {images.map((image, index) => (
          <li key={image}>
            <button
              className={`${imageIndex == index ? "bg-stone-600" : "bg-stone-300"} w-2 aspect-square rounded-full cursor-pointer`}
              onClick={() => handleSelectImage(index)}
            ></button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default FeedCarousel;
