import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import Recommendation from "@components/pages/recommendation";

async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Welcome to Social Media</CardTitle>
          <CardDescription className="text-xs">Build by Irfan</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  const userId = session.user.id;

  const following = (
    await prisma.follower.findMany({ where: { followingId: userId } })
  ).map((f) => f.followerId);

  const blockedUsers = (
    await prisma.block.findMany({
      where: { blockedById: userId },
    })
  ).map((b) => b.blockToId);

  const userRecommendation = await prisma.user.findMany({
    where: { id: { notIn: [userId, ...following, ...blockedUsers] } },
    take: 5,
  });

  return <Recommendation userRecommendation={userRecommendation} />;
}

export default Page;
