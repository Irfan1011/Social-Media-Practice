"use client";

import { useActionState } from "react";

import { signUpAction } from "@actions/auth";
import AuthLayout from "@components/layouts/auth";
import { FieldError } from "@/components/ui/field";
import { Button } from "@components/ui/button";
import { FormInput } from "@components/ui/form-input";

function Page() {
  const [state, dispatchAction, isPending] = useActionState(signUpAction, {
    errors: {
      email: [],
      password: [],
      name: [],
    },
    values: {
      email: "",
      password: "",
      name: "",
    },
  });

  return (
    <AuthLayout title="sign up">
      <form action={dispatchAction} className="flex flex-col gap-4 text-end">
        <div className="flex flex-col gap-2 w-full">
          <FormInput
            type="text"
            name="name"
            placeholder="your name"
            defaultValue={state.values.name}
          />
          {state.errors.name && (
            <FieldError className="text-start">{state.errors.name}</FieldError>
          )}
        </div>
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

export default Page;
