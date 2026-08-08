import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@components/ui/card";

type ProfileProps = {
  params: Promise<{ username: string }>;
};

async function Profile({ params }: ProfileProps) {
  const { username } = await params;
  const user = await prisma.user.findUnique({ where: { username: username } });

  if (!user) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-4 my-4">
      <Card>
        <CardHeader>
          <CardTitle>{username}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>avatar</p>
          <p>followers: 1k</p>
          <p>following: 1k</p>
          <CardDescription>desc</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardContent>Posts</CardContent>
      </Card>
    </section>
  );
}

export default Profile;
