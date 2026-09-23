import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Chat from "@components/chat/chat";

const Page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/signin");

  const followingUser = await prisma.follower.findMany({
    where: {
      followingId: session.user.id,
    },
    include: { follower: true },
  });

  return <Chat followingUser={followingUser} />;
};

export default Page;
