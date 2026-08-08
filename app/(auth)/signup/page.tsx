import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import SignUp from "@components/pages/signup";
import { redirect } from "next/navigation";

async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/");

  return <SignUp />;
}

export default Page;
