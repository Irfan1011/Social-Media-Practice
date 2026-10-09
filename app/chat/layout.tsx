import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SearchUsername from "@components/pages/searchUsername";
import ChatLists from "@components/chat/chatLists";

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
    <section className="w-full h-full md:pt-17 pt-25 grid md:grid-cols-3 gap-4 relative">
      <section className="flex flex-col gap-2 relative">
        <SearchUsername
          users={followingUser.map((f) => f.follower)}
          sessionId={session.user.id}
        ></SearchUsername>
        <ChatLists followingUser={followingUser} senderId={session.user.id} />
      </section>
      <section className="hidden md:col-span-2 md:flex flex-col justify-between gap-2">
        {children}
      </section>
    </section>
  );
};

export default Layout;
