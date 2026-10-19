import Link from "next/link";
import Image from "next/image";

import type {
  Comment,
  Notification,
  Post,
  User,
} from "@/generated/prisma/client";
import { shortDateTimeFormatter } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

type NotificationProps = {
  notification: ({ sender: User } & Notification)[];
  comment?: Comment;
  feed?: Post;
};

const Notification = ({ notification, comment, feed }: NotificationProps) => {
  return notification.map(async (notif) => (
    <article
      key={notif.id}
      className="w-full flex flex-wrap justify-between items-center mb-4"
    >
      <Link
        href={`/${notif.sender.username}`}
        className="flex gap-2 items-center"
      >
        <Avatar>
          <AvatarImage
            src={notif.sender.image || ""}
            alt={notif.sender.username}
          />
          <AvatarFallback className="uppercase">
            {notif.sender.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h1>{notif.sender.username}</h1>
      </Link>
      {comment && (
        <span>
          {comment.comment.length > 20
            ? `${comment.comment.slice(0, 20)}...`
            : comment.comment}
        </span>
      )}
      {(feed?.images || feed?.videos) && (
        <div>
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
          )}
        </div>
      )}{" "}
      <p> At {shortDateTimeFormatter.format(notif.createdAt)}</p>
    </article>
  ));
};

export default Notification;
