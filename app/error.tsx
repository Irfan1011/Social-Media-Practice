"use client";

import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardFooter,
} from "@components/ui/card";

import { Button } from "@components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

function Error({ error, unstable_retry }: ErrorProps) {
  return (
    <section className="w-[50%] aspect-square place-content-center place-items-center">
      <Card>
        <CardHeader>
          <CardTitle>{error.name || "Something Went Wrong"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" onClick={() => unstable_retry()}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

export default Error;
