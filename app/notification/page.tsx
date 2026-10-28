import { requiredSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import Notification from "@components/ui/notification";

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
            <Notification notification={followNotifications}/>
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
            <Notification notification={likeNotifications}/>
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
            <Notification notification={commentNotifications} />
          </CardContent>
        </Card>
      )}

      {(followNotifications.length === 0 && likeNotifications.length === 0 && commentNotifications.length === 0) && 
       <p>No Notification Yet!</p>
      }
    </section>
  );
};

export default Page;
