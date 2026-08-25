import { requiredSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteAccount } from "@actions/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@components/ui/card";
import { Field, FieldSeparator } from "@components/ui/field";
import { Button } from "@components/ui/button";
import UpdatePassword from "@components/pages/updatePassword";
import UpdateUserData from "@components/pages/updateUserData";

async function Page() {
  const session = await requiredSession();

  const userAccount = await prisma.account.findFirst({
    where: { userId: session.user.id },
  });

  return (
    <section className="flex flex-col gap-8 py-4">
      {/* UPDATE PROFILE */}
      <UpdateUserData
        name={session.user.name}
        username={session.user.username}
        description={session.user.description}
      />

      {/* UPDATE PASSWORD */}
      {userAccount!.providerId === "credential" && (
        <UpdatePassword
          email={session.user.email}
          username={session.user.username}
        />
      )}

      {/* DELETE ACCOUNT */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-400">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldSeparator />
            <form action={deleteAccount}>
              <input type="hidden" name="email" value={session.user.email} />
              <Button
                type="submit"
                variant="destructive"
                className="cursor-pointer"
              >
                Delete Account
              </Button>
            </form>
          </Field>
        </CardContent>
        <CardFooter>
          <p className="text-primary">*Account will be deleted permanently</p>
        </CardFooter>
      </Card>
    </section>
  );
}

export default Page;
