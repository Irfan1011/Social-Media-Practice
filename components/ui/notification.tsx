import Link from "next/link";
import Image from "next/image";

import type {
  Notification,
  User,
} from "@/generated/prisma/client";
import { shortDateTimeFormatter } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { prisma } from "@/lib/prisma";

type NotificationProps = {
  notification: ({ sender: User } & Notification)[];
};

const Notification = ({ notification }: NotificationProps) => {
  return notification.map(async (notif) => {
    const [feed, comment] = await Promise.all([prisma.post.findFirst({where: {id: notif.contentId}}), prisma.comment.findFirst({where: {id: notif.contentId}})])
    
    return <article
      key={notif.id}
      className="w-full flex flex-wrap justify-between items-center mb-4"
    >
      <Link
        href={`/${encodeURIComponent(notif.sender.username)}`}
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
          {comment.comment.length > 20 ?
            `${comment.comment.slice(0,20)}...` : 
            comment.comment}
        </span>
      )}
      {feed && (
        <div>
          {(feed.images.length > 0 || feed.videos.length > 0) ?
            <Image
            key={feed.id}
            src={feed.images[0] || feed.videos[0]}
            alt={feed.images[0] || feed.videos[0]}
            width={100}
            height={100}
            loading="eager"
            style={{width: 'auto', height: 'auto'}}
            /> :
            <span key={feed.id}>
              {feed.description.length > 20 ? `${feed.description.slice(0,20)}...` : feed.description}
            </span>}
        </div>
      )}{" "}
      <p> At {shortDateTimeFormatter.format(notif.createdAt)}</p>
    </article>
  });
};

export default Notification;