import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { followAccount, unfollowAccount } from "@actions/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import UpdateProfileImage from "@components/pages/updateProfileImage";
import UpdateFeed from "@components/feed/updateFeed";

type ProfileProps = {
  params: Promise<{ username: string }>;
};

async function Profile({ params }: ProfileProps) {
  const { username } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = await prisma.user.findUnique({
    where: { username: username },
    include: { _count: { select: { followers: true, following: true } } },
  });

  if (!user) {
    notFound();
  }

  const feeds = await prisma.post.findMany({
    where: { userId: user.id },
    include: {
      user: { select: { username: true, image: true } },
      _count: {
        select: { like: true, comment: true },
      },
      like: session
        ? { where: { userId: session?.user.id }, select: { id: true } }
        : false,
      comment: {
        select: {
          id: true,
          comment: true,
          parentId: true,
          postId: true,
          user: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const isFollowed = await prisma.follower.findFirst({
    where: {
      followerId: user.id,
      followingId: session?.user.id,
    },
  });

  return (
    <section className="flex flex-col gap-4 py-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{username}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <article className="flex justify-evenly items-center">
            <UpdateProfileImage
              userImage={user.image as string}
              username={user.username}
              isSessionUser={session?.user.username === username}
            />
            <Button
              type="button"
              variant="ghost"
              className="flex flex-col items-center gap-0 py-8 cursor-pointer"
            >
              <Link href={`/${user.username}/followers`}>
                <p>{user._count.followers}</p>
                <p>Followers</p>
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="flex flex-col items-center gap-0 py-8 cursor-pointer"
            >
              <Link href={`/${user.username}/following`}>
                <p>{user._count.following}</p>
                <p>Following</p>
              </Link>
            </Button>
          </article>
          <CardDescription className="normal-case whitespace-pre-wrap">
            {user.description || "Hallo, Selamat Datang di Post Saya!"}
          </CardDescription>
          {session?.user.username !== username && session?.user && (
            <form action={isFollowed ? unfollowAccount : followAccount}>
              {isFollowed && (
                <input type="hidden" name="followId" value={isFollowed.id} />
              )}
              <input type="hidden" name="username" value={username} />
              <Button
                type="submit"
                variant={isFollowed ? "outline" : "secondary"}
                className="w-full hover:cursor-pointer"
              >
                {isFollowed ? "Followed" : "Follow"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {feeds.map((feed) => (
            <article
              key={feed.id}
              className="border border-primary rounded-md p-4"
            >
              <UpdateFeed
                feed={feed}
                isAuthorized={session?.user.username === username}
                username={session?.user.username}
              />
            </article>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

export default Profile;
