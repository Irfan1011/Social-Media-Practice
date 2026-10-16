import { Suspense } from "react";
import { LoaderCircle } from "lucide-react";

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
        <Suspense
          fallback={
            <Skeleton className="place-items-center">
              <LoaderCircle className="animate-spin" />
            </Skeleton>
          }
        >
          {stories}
        </Suspense>

        {/* ADD FEED */}
        {children}

        {/* FEEDS */}
        <Suspense
          fallback={
            <Skeleton className="place-items-center">
              <LoaderCircle className="animate-spin" />
            </Skeleton>
          }
        >
          {feed}
        </Suspense>
      </article>

      {/* RIGHT */}
      <article className="hidden md:block w-full">
        <Suspense
          fallback={
            <Skeleton className="place-items-center">
              <LoaderCircle className="animate-spin" />
            </Skeleton>
          }
        >
          {recommendation}
        </Suspense>
      </article>
    </section>
  );
}

export default HomeLayout;
