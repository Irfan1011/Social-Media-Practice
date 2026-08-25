import { Suspense } from "react";

import { Skeleton } from "@components/ui/skeleton";

type LayoutProps = {
  feed: React.ReactNode;
  recommendation: React.ReactNode;
  stories: React.ReactNode;
  children: React.ReactNode;
};

function HomeLayout({ feed, recommendation, stories, children }: LayoutProps) {
  return (
    <section className="grid md:grid-cols-[minmax(70%,1fr)_1fr] gap-8 min-w-full min-h-full mt-17 justify-items-center">
      {/* LEFT */}
      <article className="flex flex-col gap-4 w-full mb-4">
        {/* STORIES */}
        <Suspense fallback={<Skeleton>Loading...</Skeleton>}>
          {stories}
        </Suspense>

        {/* ADD FEED */}
        {children}

        {/* FEEDS */}
        <Suspense fallback={<Skeleton>Loading...</Skeleton>}>{feed}</Suspense>
      </article>

      {/* RIGHT */}
      <article className="hidden md:block w-full">
        <Suspense fallback={<Skeleton>Loading...</Skeleton>}>
          {recommendation}
        </Suspense>
      </article>
    </section>
  );
}

export default HomeLayout;
