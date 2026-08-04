"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, UserRoundMinus, UserRoundX } from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@components/ui/sidebar";

function sidebarContent() {
  const pathname = usePathname();

  return (
    <SidebarContent className="p-4">
      <SidebarGroup>
        <SidebarGroupLabel>Pages</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton
                className="cursor-pointer"
                isActive={pathname === "/"}
              >
                <Home /> Feed
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/chat">
              <SidebarMenuButton
                className="cursor-pointer"
                isActive={pathname === "/chat"}
              >
                <MessageCircle /> Chat
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>More</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/unfollowers">
              <SidebarMenuButton
                className="cursor-pointer"
                isActive={pathname === "/unfollowers"}
              >
                <UserRoundMinus /> Unfollowers
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/block">
              <SidebarMenuButton
                className="cursor-pointer"
                isActive={pathname === "/block"}
              >
                <UserRoundX /> Block
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}

export default sidebarContent;
