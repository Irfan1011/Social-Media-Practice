import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import AddStory from "@components/story/addStory";
import Stories from "@components/story/stories";

async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return null;
  const followers = (
    await prisma.follower.findMany({ where: { followingId: session.user.id } })
  ).map((f) => f.followerId);

  const stories = await prisma.story.findMany({
    where: {
      userId: { in: [session.user.id, ...followers] },
      expiredAt: { gt: new Date() },
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stories</CardTitle>
      </CardHeader>
      <CardContent className="flex items-start gap-4">
        <AddStory />

        <ul className="flex gap-4 overflow-x-scroll scrollbar-none">
          <Stories stories={stories} sessionId={session.user.id} />
        </ul>
      </CardContent>
    </Card>
  );
}

export default Page;
