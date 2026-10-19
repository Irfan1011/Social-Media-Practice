"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowBigUp } from "lucide-react";

import type { User } from "@/generated/prisma/client";
import { followAccount } from "@actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

type RecommendationProps = {
  userRecommendation: User[];
};

const Recommendation = ({ userRecommendation }: RecommendationProps) => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const scrollVisible = () => {
      setShowScroll(window.scrollY > 100);
    };

    window.addEventListener("scroll", scrollVisible, {
      passive: true,
    });

    scrollVisible();

    return () => {
      window.removeEventListener("scroll", scrollVisible);
    };
  }, []);

  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Card className="sticky top-[12%]">
        <CardHeader>
          <CardTitle className="text-sm">Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          {userRecommendation.length <= 0 && (
            <CardTitle className="text-sm">All user are followed</CardTitle>
          )}
          {userRecommendation.map((user) => (
            <div
              key={user.id}
              className="flex flex-wrap justify-between items-center mb-2"
            >
              <Link
                href={`/${user.username}`}
                className="w-fit flex items-center gap-2"
              >
                <Avatar>
                  <AvatarImage src={user.image || ""} alt={user.username} />
                  <AvatarFallback className="uppercase">
                    {user.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="capitalize">{user.username}</span>
              </Link>
              <form action={followAccount}>
                <input type="hidden" name="username" value={user.username} />
                <Button
                  type="submit"
                  variant="link"
                  className="cursor-pointer text-foreground text-xs hover:text-primary p-0"
                >
                  Follow
                </Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>
      {showScroll && (
        <Button
          variant="outline"
          className="rounded-full scale-130 cursor-pointer fixed bottom-10 right-10"
          onClick={handleScroll}
        >
          <ArrowBigUp />
        </Button>
      )}
    </>
  );
};

export default Recommendation;
