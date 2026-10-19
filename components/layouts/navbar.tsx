import Link from "next/link";
import { Bell, Moon, Sun } from "lucide-react";

import { requiredSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signOut } from "@actions/auth";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import Hamburger from "@components/ui/hamburger";
import SelectTheme from "@components/ui/selectTheme";
import SearchUsername from "@components/pages/searchUsername";
import Notification from "@components/ui/notification";

async function Navbar() {
  const session = await requiredSession();

  const users = await prisma.user.findMany();

  const followNotifications = await prisma.notification.findMany({
    where: { receiverId: session.user.id, type: "FOLLOW" },
    include: { sender: true },
  });

  const likeNotifications = await prisma.notification.findMany({
    where: { receiverId: session.user.id, type: "LIKE" },
    include: { sender: true },
  });

  const commentNotifications = await prisma.notification.findMany({
    where: { receiverId: session.user.id, type: "COMMENT" },
    include: { sender: true },
  });

  return (
    <header className="p-4 bg-sidebar fixed w-full z-1">
      <NavigationMenu className="min-w-full">
        <NavigationMenuList className="justify-between gap-4">
          {/* BRAND LEFT SIDE */}
          <NavigationMenuItem>
            <Link href="/" className="font-bold text-primary uppercase">
              Social
            </Link>
          </NavigationMenuItem>

          {/* SEARCH MID SIDE */}
          <NavigationMenuItem className="flex-1 max-w-[50%]">
            <SearchUsername users={users} />
          </NavigationMenuItem>

          {/* MENU RIGHT SIDE */}
          <NavigationMenuItem className="flex gap-2">
            {/* NOTIFICATION */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="hidden md:block cursor-pointer px-2.5 rounded-sm in-data-[slot=button-group]:rounded-md hover:bg-muted hover:text-foreground dark:hover:bg-muted/50">
                    <Bell className="h-[1.2rem] w-[1.2rem] transition-all" />
                  </button>
                }
              />
              <DropdownMenuContent className="min-w-2xs max-w-3xs">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  {followNotifications.length > 0 && (
                    <DropdownMenuItem className="flex flex-col items-start">
                      <DropdownMenuLabel>New Follower</DropdownMenuLabel>
                      <Notification
                        notification={followNotifications.slice(0, 3).sort()}
                      />
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {likeNotifications.length > 0 && (
                    <DropdownMenuItem className="flex flex-col items-start">
                      <DropdownMenuLabel>
                        Someone like your feed
                      </DropdownMenuLabel>
                      <Notification
                        notification={likeNotifications.slice(0, 3).sort()}
                      />
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {commentNotifications.length > 0 && (
                    <DropdownMenuItem className="flex flex-col items-start">
                      <DropdownMenuLabel>
                        Someone leave a comment
                      </DropdownMenuLabel>
                      <Notification
                        notification={commentNotifications.slice(0, 3).sort()}
                      />
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* THEME */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="hidden md:block cursor-pointer px-2.5 rounded-sm in-data-[slot=button-group]:rounded-md hover:bg-muted hover:text-foreground dark:hover:bg-muted/50">
                    <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:hidden" />
                    <Moon className="hidden h-[1.2rem] w-[1.2rem] transition-all dark:block" />
                  </button>
                }
              />
              <DropdownMenuContent>
                <SelectTheme />
              </DropdownMenuContent>
            </DropdownMenu>

            {/* HAMBURGER */}
            <Hamburger
              isAuth={session.user ? true : false}
              username={session?.user.username}
            />

            {/* AUTHENTICATION */}
            {session ? (
              <form action={signOut} className="hidden md:block">
                <Button
                  type="submit"
                  variant="outline"
                  className="font-bold text-primary capitalize cursor-pointer"
                >
                  sign out
                </Button>
              </form>
            ) : (
              <div className="hidden md:block">
                <NavigationMenuLink
                  href="signin"
                  className={navigationMenuTriggerStyle()}
                  render={<Link href="/signin" />}
                >
                  Sign In
                </NavigationMenuLink>
                <NavigationMenuLink
                  href="signup"
                  className={navigationMenuTriggerStyle()}
                  render={<Link href="/signup" />}
                >
                  Sign Up
                </NavigationMenuLink>
              </div>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}

export default Navbar;
