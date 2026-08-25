import { prisma } from "@/lib/prisma";
import Followers from "@components/pages/follow";

type FollowersProps = {
  params: Promise<{ username: string }>;
};

async function Page({ params }: FollowersProps) {
  const { username } = await params;

  const userId = await prisma.user.findFirst({
    where: { username: username },
  });

  if (!userId) throw new Error("User Not Found");

  const followers = await prisma.follower.findMany({
    where: {
      followerId: userId.id,
    },
    include: { following: true },
  });

  return (
    <Followers
      username={userId.username}
      title="Followers"
      follows={followers.map((follower) => follower.following)}
    />
  );
}

export default Page;
