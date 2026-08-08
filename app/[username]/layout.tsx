import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import ProfileNavigation from "@components/layouts/profileNavigation";

type ProfileLayoutProps = {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
};

async function Layout({ params, children }: ProfileLayoutProps) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user) {
    notFound();
  }

  return (
    <section className="w-full h-full mt-17 capitalize">
      <ProfileNavigation username={user.username} />
      {children}
    </section>
  );
}

export default Layout;
