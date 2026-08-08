import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import SignIn from "@components/pages/signin";
import { redirect } from "next/navigation";

async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/");

  return <SignIn />;
}

export default Page;
