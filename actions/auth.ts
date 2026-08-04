"use server";

import * as z from "zod";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import {
  signUpValidator,
  signInValidator,
  emailValidator,
  passwordValidator,
} from "./validator";

export const signUpAction = async (prevState: object, formData: FormData) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
  };

  const validator = await signUpValidator({ ...data });

  if (!validator.success) {
    const res = z.flattenError(validator.error);

    return {
      ...prevState,
      errors: {
        email: res.fieldErrors.email,
        password: res.fieldErrors.password,
        name: res.fieldErrors.name,
      },
      values: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    };
  }

  await auth.api.signUpEmail({
    body: data,
  });

  redirect("/signin");
};

export const signInAction = async (prevState: object, formData: FormData) => {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validator = await signInValidator({ ...data });

  if (!validator.success) {
    const res = z.flattenError(validator.error);

    return {
      ...prevState,
      errors: {
        email: res.fieldErrors.email,
        password: res.fieldErrors.password,
      },
      values: {
        email: data.email,
        password: data.password,
      },
    };
  }

  await auth.api.signInEmail({
    body: data,
  });

  redirect("/");
};

export const signOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/");
};

export const sendForgetPassword = async (_: unknown, formData: FormData) => {
  const email = formData.get("email") as string;

  const validator = await emailValidator({ email });

  if (!validator.success) {
    const err = z.prettifyError(validator.error);

    return {
      success: validator.success,
      message: err.split("→")[0],
    };
  }

  await auth.api.requestPasswordReset({
    body: {
      email: email,
      redirectTo: "http://localhost:3000/reset-password",
    },
  });

  return { success: true, message: "Reset Password Sent, Check Your Email" };
};

export const resetPassword = async (_: unknown, formData: FormData) => {
  const newPassword = formData.get("newPassword") as string;
  const token = formData.get("token") as string;

  const validator = await passwordValidator({ password: newPassword });

  if (!validator.success) {
    const err = z.prettifyError(validator.error);

    return {
      success: validator.success,
      message: err.split("→")[0],
    };
  }

  await auth.api.resetPassword({
    body: {
      newPassword: newPassword,
      token,
    },
  });

  redirect("/signin");
};

export const updatePassword = async (formData: FormData) => {
  const oldPassword = formData.get("oldPassword") as string;
  const currentPassword = formData.get("currentPassword") as string;

  await auth.api.changePassword({
    body: {
      newPassword: oldPassword,
      currentPassword: currentPassword,
      revokeOtherSessions: true,
    },
    headers: await headers(),
  });
};
