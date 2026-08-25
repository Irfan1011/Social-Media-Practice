import { prisma } from "@/lib/prisma";
import FollowDialog from "@components/ui/followDialog";

type InterceptedFollowerProps = {
  params: Promise<{ username: string }>;
};

async function Page({ params }: InterceptedFollowerProps) {
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
    <FollowDialog
      username={userId.username}
      title="Followers"
      follows={followers.map((follower) => follower.following)}
    />
  );
}

export default Page;
