import Form from "next/form";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Camera, EllipsisVertical, UserRoundMinus } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { followAccount, blockAccount } from "@actions/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";
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
    where: { username: decodeURIComponent(username) },
    include: { following:true, followers: true },
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
      like: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          postId: true,
          user: true,
        },
      },
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

  const isBlocked = await prisma.block.findFirst({
    where: { blockToId: user.id },
  });

  return (
    <section className="flex flex-col gap-4 py-4">
      <Card>
        <CardHeader className="relative">
          <CardTitle className="text-center">{decodeURIComponent(username)}</CardTitle>
          {session?.user.username !== decodeURIComponent(username) && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="absolute -top-2 right-4 rounded-full text-primary cursor-pointer p-2 hover:bg-muted hover:text-foreground dark:hover:bg-muted/50">
                    <EllipsisVertical />
                  </button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <Form action={blockAccount}>
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="username" value={decodeURIComponent(username)} />
                    <DropdownMenuItem>
                      <Button
                        type="submit"
                        variant="ghost"
                        className="w-full cursor-pointer"
                      >
                        <UserRoundMinus />
                        {isBlocked ? "Unblocked" : "Block"}
                      </Button>
                    </DropdownMenuItem>
                  </Form>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <article className="flex justify-evenly items-center">
            <UpdateProfileImage
              userImage={user.image as string}
              username={user.username}
              isSessionUser={session?.user.username === decodeURIComponent(username)}
            />
            <Button
              type="button"
              variant="ghost"
              className="flex flex-col items-center gap-0 py-8 cursor-pointer"
            >
              <Link href={`/${user.username}/followers`}>
                <p>{user.followers.length}</p>
                <p>Followers</p>
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="flex flex-col items-center gap-0 py-8 cursor-pointer"
            >
              <Link href={`/${user.username}/following`}>
                <p>{user.following.length}</p>
                <p>Following</p>
              </Link>
            </Button>
          </article>
          <CardDescription className="normal-case whitespace-pre-wrap">
            {user.description || "Hallo, Selamat Datang di Post Saya!"}
          </CardDescription>
          {session?.user.username !== decodeURIComponent(username) &&
            session?.user &&
            !isBlocked && (
              <form action={followAccount}>
                <input type="hidden" name="username" value={decodeURIComponent(username)} />
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
          {feeds.length <= 0 && (
            <article className="flex flex-col items-center border border-primary rounded-md p-4">
              <p className="font-medium">No Post Yet.</p>
              {session?.user.username === user.username && (
                <Link
                  href="/"
                  className=" w-fit flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer hover:bg-secondary"
                >
                  <Camera /> Add my first Post
                </Link>
              )}
            </article>
          )}
          {!isBlocked &&
            feeds.map((feed) => (
              <article
                key={feed.id}
                className="border border-primary rounded-md p-4"
              >
                <UpdateFeed
                  feed={feed}
                  isAuthorized={session?.user.username === decodeURIComponent(username)}
                  session={session?.user}
                />
              </article>
            ))}
          {isBlocked && <p>Success Blocked This User</p>}
        </CardContent>
      </Card>
    </section>
  );
}

export default Profile;
