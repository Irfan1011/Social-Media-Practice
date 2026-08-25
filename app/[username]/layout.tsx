import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import ProfileNavigation from "@components/layouts/profileNavigation";

type ProfileLayoutProps = {
  children: React.ReactNode;
};

async function Layout({ children }: ProfileLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <section className="w-full h-full mt-17 capitalize">
      {session && <ProfileNavigation username={session.user.username} />}
      {children}
    </section>
  );
}

export default Layout;
