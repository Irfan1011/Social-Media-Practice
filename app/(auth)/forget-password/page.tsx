"use client";

import { useActionState } from "react";

import { sendForgetPassword } from "@/actions/auth";
import { Card, CardContent } from "@components/ui/card";
import {
  Field,
  FieldSeparator,
  FieldTitle,
  FieldDescription,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@components/ui/field";
import { Button } from "@components/ui/button";

function Page() {
  const [state, dispatchAction, isPending] = useActionState(
    sendForgetPassword,
    { success: true, message: "" },
  );

  return (
    <section className="w-70 h-full place-content-center capitalize">
      <Card>
        <CardContent>
          <Field>
            <FieldTitle>Forget Password</FieldTitle>
            <FieldSeparator />
            <FieldContent>
              <form action={dispatchAction}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldGroup className="gap-2">
                  <input
                    type="text"
                    name="email"
                    placeholder="example@example.com"
                    className="border rounded-md p-2"
                    required
                  />
                  {!state.success && <FieldError>{state.message}</FieldError>}
                  <Button
                    variant="secondary"
                    type="submit"
                    className="cursor-pointer"
                  >
                    {isPending ? "Sending..." : "Send"}
                  </Button>
                  {state.success && (
                    <FieldDescription>{state.message}</FieldDescription>
                  )}
                </FieldGroup>
              </form>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>
    </section>
  );
}

export default Page;
