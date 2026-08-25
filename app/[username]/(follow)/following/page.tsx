import { prisma } from "@/lib/prisma";
import Following from "@components/pages/follow";

type FollowersProps = {
  params: Promise<{ username: string }>;
};

async function Page({ params }: FollowersProps) {
  const { username } = await params;

  const userId = await prisma.user.findFirst({
    where: { username: username },
  });

  if (!userId) throw new Error("User Not Found");

  const following = await prisma.follower.findMany({
    where: {
      followingId: userId.id,
    },
    include: { follower: true },
  });

  return (
    <Following
      username={userId.username}
      title="Following"
      follows={following.map((follow) => follow.follower)}
    />
  );
}

export default Page;
