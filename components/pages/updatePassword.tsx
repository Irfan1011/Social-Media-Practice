"use client";

import { useActionState } from "react";

import { updatePassword } from "@actions/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@components/ui/card";
import {
  Field,
  FieldSeparator,
  FieldContent,
  FieldError,
} from "@components/ui/field";
import { FormInput } from "@components/ui/form-input";
import { Button } from "@components/ui/button";

type UpdatePasswordProps = {
  email: string;
  username: string;
};

function UpdatePassword({ email, username }: UpdatePasswordProps) {
  const [state, dispatchAction, isLoading] = useActionState(updatePassword, "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldSeparator />
          <FieldContent>
            <form action={dispatchAction} className="flex flex-col gap-4">
              <FormInput
                type="email"
                name="email"
                placeholder="example@example.com"
                defaultValue={email}
                isDisabled={true}
              />
              <FormInput
                type="password"
                name="newPassword"
                placeholder="Password"
              />
              <FormInput
                type="password"
                name="currentPassword"
                placeholder="Password"
              />
              {state !== undefined && <FieldError>{state}</FieldError>}
              <input type="hidden" name="username" value={username} />
              <Button
                type="submit"
                variant="outline"
                className="cursor-pointer"
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </form>
          </FieldContent>
          <FieldSeparator />
        </Field>
      </CardContent>
      <CardFooter>
        <p className="text-primary">(*)field required</p>
      </CardFooter>
    </Card>
  );
}

export default UpdatePassword;
