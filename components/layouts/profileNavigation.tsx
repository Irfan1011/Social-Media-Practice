"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@components/ui/navigation-menu";

type ProfileNavigationProps = {
  username: string;
};

function ProfileNavigation({ username }: ProfileNavigationProps) {
  const path = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} ${path === `/${encodeURIComponent(username)}` && "bg-secondary"}`}
            render={<Link href={`/${encodeURIComponent(username)}`} />}
          >
            Profile
          </NavigationMenuLink>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} ${path === `/${encodeURIComponent(username)}/setting` && "bg-secondary"}`}
            render={<Link href={`/${encodeURIComponent(username)}/setting`} />}
          >
            Setting
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default ProfileNavigation;
