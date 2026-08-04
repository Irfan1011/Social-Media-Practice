"use client";

import { createAuthClient } from "better-auth/react";

import { Button } from "@components/ui/button";

function LoginWithGoogle() {
  const authClient = createAuthClient();

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <Button
      variant="secondary"
      className="cursor-pointer rounded-full w-fit"
      onClick={handleGoogleSignIn}
    >
      Google
    </Button>
  );
}

export default LoginWithGoogle;
