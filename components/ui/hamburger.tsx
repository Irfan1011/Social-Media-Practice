"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Bell,
  MessageCircle,
  Moon,
  Sun,
  User,
  UserRoundMinus,
  UserRoundX,
} from "lucide-react";
import { useTheme } from "next-themes";

import { signOut } from "@actions/auth";
import { Button } from "@components/ui/button";

type HamburgerProps = {
  isAuth: boolean;
  username?: string;
};

function Hamburger({ isAuth, username }: HamburgerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme } = useTheme();

  const handleHamburger = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="flex flex-col gap-1 cursor-pointer md:hidden"
        onClick={handleHamburger}
      >
        <hr
          className={`w-6 h-1 bg-primary border-primary rounded-sm origin-left transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}
        />
        <hr
          className={`w-6 h-1 bg-primary border-primary rounded-sm transition-transform duration-500 ${isOpen ? "invisible" : ""}`}
        />
        <hr
          className={`w-6 h-1 bg-primary border-primary rounded-sm origin-left transition-transform duration-500 ${isOpen ? "-rotate-45" : ""}`}
        />
      </Button>

      {/* OPEN MOBILE HAMBURGER */}
      {isOpen && (
        <ul className="grid grid-flow-row gap-4 justify-items-start place-content-center rounded-sm p-4 text-sm bg-secondary absolute top-14 right-0 md:hidden">
          {/* ROUTE */}
          {username && (
            <>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/" className="flex gap-2 place-items-center">
                  Feed <Home />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/chat" className="flex gap-2 place-items-center">
                  Chat <MessageCircle />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                <Link
                  href={`/${username}`}
                  className="flex gap-2 place-items-center"
                >
                  Profile <User />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                <Link
                  href="notif"
                  className="capitalize flex items-center gap-2"
                >
                  Notification <Bell />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                <Link
                  href="/unfollowers"
                  className="flex gap-2 place-items-center"
                >
                  Unfollowers <UserRoundMinus />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/block" className="flex gap-2 place-items-center">
                  Block <UserRoundX />
                </Link>
              </Button>
            </>
          )}

          {/* THEME */}
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={() =>
              setTheme((prev) => (prev === "dark" ? "light" : "dark"))
            }
          >
            Theme
            <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:hidden" />
            <Moon className="hidden h-[1.2rem] w-[1.2rem] transition-all dark:block" />
          </Button>

          {/* AUTH */}
          {isAuth ? (
            <form action={signOut} className="w-full">
              <Button
                type="submit"
                variant="outline"
                className="w-full text-primary cursor-pointer capitalize"
              >
                sign out
              </Button>
            </form>
          ) : (
            <>
              <Button
                variant="outline"
                className="text-primary w-full cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <Link href="signin" className="capitalize">
                  Sign In
                </Link>
              </Button>
              <Button
                variant="outline"
                className="text-primary w-full cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <Link href="signup" className="capitalize">
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default Hamburger;
