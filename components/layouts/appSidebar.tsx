import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import {
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@components/ui/sidebar";
import {
  Avatar,
  AvatarImage,
  AvatarBadge,
  AvatarFallback,
} from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import SidebarContent from "@components/pages/sidebarContent";

async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <Sidebar
      collapsible="icon"
      className="fixed max-h-[calc(100vh-68px)] mt-17 z-1"
    >
      <SidebarTrigger className="absolute -right-8 cursor-pointer my-4" />
      <SidebarSeparator />

      {/* HEADER */}
      <SidebarHeader>
        {session ? (
          <Button variant="ghost" className="justify-start cursor-pointer py-8">
            <Link
              href={`/${encodeURIComponent(session.user.username)}`}
              className="flex items-center gap-4 overflow-hidden"
            >
              <Avatar size="lg">
                <AvatarImage
                  src={session.user.image || ""}
                  alt={session.user.name}
                />
                <AvatarFallback>
                  {session.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
              </Avatar>
              <span>{session.user.name}</span>
            </Link>
          </Button>
        ) : (
          <Link href="/signin" className="overflow-hidden">
            <Button
              variant="ghost"
              className="flex gap-4 justify-start cursor-pointer py-8 w-full"
            >
              <Avatar size="lg">
                <AvatarImage src="" alt="" />
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
              Login
            </Button>
          </Link>
        )}
      </SidebarHeader>
      <SidebarSeparator />

      {/* CONTENT */}
      <SidebarContent />
      <SidebarSeparator />

      {/* FOOTER */}
      <SidebarFooter className="p-4 text-center">
        <p className="text-sm font-extralight">Made By Irfan</p>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
