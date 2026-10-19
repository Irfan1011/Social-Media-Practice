import Link from "next/link";
import Image from "next/image";

import { requiredSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { shortDateTimeFormatter } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";

const Page = async () => {
  const session = await requiredSession();

  const followNotifications = await prisma.notification.findMany({
    where: { receiverId: session.user.id, type: "FOLLOW" },
    include: { sender: true },
  });

  const likeNotifications = await prisma.notification.findMany({
    where: { receiverId: session.user.id, type: "LIKE" },
    include: { sender: true },
  });

  const commentNotifications = await prisma.notification.findMany({
    where: { receiverId: session.user.id, type: "COMMENT" },
    include: { sender: true },
  });

  return (
    <section className="w-full mt-17 grid gap-4">
      <h1>Notification</h1>

      {/* FOLLOW NOTIFICATIONS */}
      {followNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Follow</CardTitle>
            <CardDescription>You got a follower</CardDescription>
          </CardHeader>
          <CardContent>
            {followNotifications.map((follow) => (
              <article
                key={follow.id}
                className="flex flex-wrap justify-between items-center mb-4"
              >
                <Link
                  href={`/${follow.sender.username}`}
                  className="flex gap-2 items-center"
                >
                  <Avatar>
                    <AvatarImage
                      src={follow.sender.image || ""}
                      alt={follow.sender.username}
                    />
                    <AvatarFallback className="uppercase">
                      {follow.sender.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{follow.sender.username}</CardTitle>
                </Link>
                <CardDescription>
                  At {shortDateTimeFormatter.format(follow.createdAt)}
                </CardDescription>
              </article>
            ))}
          </CardContent>
        </Card>
      )}

      {/* LIKE NOTIFICATIONs */}
      {likeNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Like</CardTitle>
            <CardDescription>Your feed get likes</CardDescription>
          </CardHeader>
          <CardContent>
            {likeNotifications.map(async (like) => {
              const feed = await prisma.post.findFirst({
                where: { id: like.contentId },
              });

              if (!feed) return null;
              return (
                <article
                  key={like.id}
                  className="flex flex-wrap justify-between items-center mb-4"
                >
                  <Link
                    href={`/${like.sender.username}`}
                    className="flex gap-2 items-center"
                  >
                    <Avatar>
                      <AvatarImage
                        src={like.sender.image || ""}
                        alt={like.sender.username}
                      />
                      <AvatarFallback className="uppercase">
                        {like.sender.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle>{like.sender.username}</CardTitle>
                  </Link>
                  <CardDescription className="flex gap-2">
                    {feed.images.length > 0 || feed.videos.length > 0 ? (
                      <Image
                        src={feed.images[0] || feed.videos[0]}
                        alt={feed.images[0] || feed.videos[0]}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <span>
                        {feed.description.length > 20
                          ? `${feed.description.slice(0, 20)}...`
                          : feed.description}
                      </span>
                    )}{" "}
                    At {shortDateTimeFormatter.format(like.createdAt)}
                  </CardDescription>
                </article>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* COMMENT NOTIFICATIONS */}
      {commentNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comment</CardTitle>
            <CardDescription>Someone leave a comment</CardDescription>
          </CardHeader>
          <CardContent>
            {commentNotifications.map(async (comment) => {
              const feedComment = await prisma.comment.findFirst({
                where: { id: comment.contentId },
              });

              if (!feedComment) return null;
              return (
                <article
                  key={comment.id}
                  className="flex flex-wrap justify-between items-center mb-4"
                >
                  <Link
                    href={`/${comment.sender.username}`}
                    className="flex gap-2 items-center"
                  >
                    <Avatar>
                      <AvatarImage
                        src={comment.sender.image || ""}
                        alt={comment.sender.username}
                      />
                      <AvatarFallback className="uppercase">
                        {comment.sender.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle>{comment.sender.username}</CardTitle>
                  </Link>
                  <CardDescription>
                    <span>
                      {feedComment.comment.length > 20
                        ? `${feedComment.comment.slice(0, 20)}...`
                        : feedComment.comment}
                    </span>{" "}
                    At {shortDateTimeFormatter.format(comment.createdAt)}
                  </CardDescription>
                </article>
              );
            })}
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default Page;
