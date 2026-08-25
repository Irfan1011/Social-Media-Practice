"use client";

import { useState } from "react";

type LoadFeedDescriptionProps = {
  description: string;
};

function feedDescription({ description }: LoadFeedDescriptionProps) {
  const [isLoadMore, setIsLoadMore] = useState(false);

  const handleLoadMore = () => {
    setIsLoadMore((prev) => !prev);
  };

  return (
    <article className="normal-case whitespace-pre-wrap wrap-anywhere text-justify">
      <p>
        {isLoadMore ? description : description.slice(0, 255)}{" "}
        {description.length > 255 && (
          <span
            className="text-stone-600 cursor-pointer hover:text-stone-500"
            onClick={handleLoadMore}
          >
            {isLoadMore ? "Show Less" : "Load More..."}
          </span>
        )}
      </p>
    </article>
  );
}

export default feedDescription;
