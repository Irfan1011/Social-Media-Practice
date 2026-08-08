import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@components/ui/card";
import { Field, FieldSeparator, FieldContent } from "@components/ui/field";
import {
  FormInputEmail,
  FormInputPassword,
  FormInput,
} from "@components/ui/form-input";
import { Button } from "@components/ui/button";

async function Page() {
  const sessions = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessions) {
    redirect("/signup");
  }

  return (
    <section className="flex flex-col gap-8 my-4">
      {/* UPDATE PROFILE */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldSeparator />
            <FieldContent>
              <form action="" className="flex flex-col items-center gap-4">
                <FormInput name="name" defaultValue={sessions.user.name} />
                <FormInput
                  name="username"
                  defaultValue={sessions.user.username}
                />
                <FormInputEmail defaultValue={sessions.user.email} />
                <FormInputPassword text="password" defaultValue="" />
                <Button variant="outline" className="cursor-pointer">
                  Update
                </Button>
              </form>
            </FieldContent>
            <FieldSeparator />
          </Field>
        </CardContent>
        <CardFooter>
          <p className="text-secondary">testing</p>
        </CardFooter>
      </Card>

      {/* DELETE ACCOUNT */}
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="cursor-pointer">
            Delete Account
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-secondary">testing</p>
        </CardFooter>
      </Card>
    </section>
  );
}

export default Page;
