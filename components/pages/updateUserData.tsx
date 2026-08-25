"use client";

import { useActionState } from "react";

import { updateUserData } from "@actions/auth";
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
import { FormInput, FormArea } from "@components/ui/form-input";
import { Button } from "@components/ui/button";

type UpdateUserProps = {
  name: string;
  username: string;
  description: string;
};

function UpdateUserData({ name, username, description }: UpdateUserProps) {
  const [state, dispatchAction, isLoading] = useActionState(updateUserData, "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldSeparator />
          <FieldContent>
            <form action={dispatchAction} className="flex flex-col gap-4">
              <FormInput
                type="text"
                name="name"
                placeholder="your name"
                defaultValue={name}
              />
              <FormInput
                type="text"
                name="username"
                placeholder="username"
                defaultValue={username}
              />
              <FormArea
                name="description"
                placeholder="Halo, Selamat Datang di Post Saya!"
                defaultValue={description}
              />
              {state !== undefined && <FieldError>{state}</FieldError>}
              <Button
                type="submit"
                variant="outline"
                className="cursor-pointer"
                disabled={isLoading}
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

export default UpdateUserData;
