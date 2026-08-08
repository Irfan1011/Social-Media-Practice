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
  FieldError,
} from "@components/ui/field";
import { Button } from "@components/ui/button";
import { FormInputEmail } from "@components/ui/form-input";

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
              <form action={dispatchAction} className="flex flex-col gap-2">
                <FormInputEmail />
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
              </form>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>
    </section>
  );
}

export default Page;
