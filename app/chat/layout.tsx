import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ChatLayout from "@components/layouts/chat";

export const metadata: Metadata = {
  title: "Chat",
  description: "Social Media Chat",
};

type ChatLayoutProps = {
  children: React.ReactNode;
};

const Layout = async ({ children }: ChatLayoutProps) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/signin");

  const followingUser = await prisma.follower.findMany({
    where: {
      followingId: session.user.id,
    },
    include: { follower: true },
  });

  return (
    <ChatLayout sessionId={session.user.id} followingUser={followingUser}>
      {children}
    </ChatLayout>
  );
};

export default Layout;
