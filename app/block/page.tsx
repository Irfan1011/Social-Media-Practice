import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";

const Page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/signin");

  const blockedUser = await prisma.block.findMany({
    where: {
      blockedById: session.user.id,
    },
  });

  const users = await prisma.user.findMany({
    where: { id: { in: [...blockedUser.map((b) => b.blockToId)] } },
  });

  return (
    <section className="w-full mt-17">
      <Card>
        <CardHeader>
          <CardTitle>Block</CardTitle>
          <CardDescription>The user who don't follow you back</CardDescription>
        </CardHeader>
        {users.length > 0 && (
          <CardContent className="grid auto-rows-fr auto-cols-min">
            {users.map((user) => (
              <Link key={user.id} href={`/${encodeURIComponent(user.username)}`}>
                <Button variant="ghost" className="py-8 cursor-pointer">
                  <Avatar>
                    <AvatarImage src={user.image || ""} alt={user.username} />
                    <AvatarFallback className="uppercase">
                      {user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{user.username}</CardTitle>
                </Button>
              </Link>
            ))}
          </CardContent>
        )}
        {users.length <= 0 && <CardFooter>No Blocked User Found</CardFooter>}
      </Card>
    </section>
  );
};

export default Page;
