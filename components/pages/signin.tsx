"use client";

import { useActionState } from "react";

import { signInAction } from "@actions/auth";
import AuthLayout from "@components/layouts/auth";
import { FieldError } from "@components/ui/field";
import { Button } from "@components/ui/button";
import { FormInput } from "@components/ui/form-input";

function SignIn() {
  const [state, dispatchAction, isPending] = useActionState(signInAction, {
    errors: {
      email: [],
      password: [],
    },
    values: {
      email: "",
      password: "",
    },
  });

  return (
    <AuthLayout title="sign in">
      <form action={dispatchAction} className="flex flex-col gap-4 text-end">
        <div className="flex flex-col gap-2 w-full">
          <FormInput
            type="email"
            name="email"
            placeholder="example@example.com"
            defaultValue={state.values.email}
          />
          {state.errors.email && (
            <FieldError className="text-start">{state.errors.email}</FieldError>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <FormInput
            type="password"
            name="password"
            placeholder="Password"
            defaultValue={state.values.password}
          />
          {state.errors.password && (
            <FieldError className="text-start">
              {state.errors.password}
            </FieldError>
          )}
        </div>
        <Button
          type="submit"
          variant="outline"
          className="cursor-pointer"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default SignIn;
