"use client";

import { redirect } from "next/navigation";
import { use, useActionState } from "react";

import { resetPassword } from "@actions/auth";
import { Card, CardContent } from "@components/ui/card";
import {
  Field,
  FieldSeparator,
  FieldTitle,
  FieldError,
  FieldContent,
} from "@components/ui/field";
import { FormInputPassword } from "@components/ui/form-input";
import { Button } from "@components/ui/button";

type ResetPasswordProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function Page({ searchParams }: ResetPasswordProps) {
  const [state, dispatchAction, isPending] = useActionState(resetPassword, {
    success: true,
    message: "",
  });
  const token = use(searchParams).token;

  if (!token) {
    redirect("/forget-password");
  }

  return (
    <section className="w-70 h-full place-content-center capitalize">
      <Card>
        <CardContent>
          <Field>
            <FieldContent className="gap-4 capitalize">
              <FieldTitle>Reset Password</FieldTitle>
              <FieldSeparator />

              <form
                action={dispatchAction}
                className="flex justify-center flex-col gap-2"
              >
                <FormInputPassword text="newPassword" />
                {!state.success && <FieldError>{state.message}</FieldError>}

                <input type="hidden" name="token" value={token} />
                <Button
                  variant="outline"
                  type="submit"
                  className="capitalize cursor-pointer"
                >
                  {isPending ? "Resetting..." : "Reset"}
                </Button>
              </form>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>
    </section>
  );
}

export default Page;
