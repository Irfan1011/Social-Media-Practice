import * as z from "zod";

type AuthProps = {
  email?: string;
  password?: string;
  name?: string;
};

const signUpSchema = z.object({
  email: z.email({ error: "Email is invalid" }).trim(),
  password: z
    .string()
    .regex(
      /(?=.*[@$!%*?&])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)\S{8,}/g,
      "Password must contain at least 1 uppercase, lowercase, number, and special character",
    )
    .min(8, "Password Must At Least 8 Length")
    .trim(),
  name: z
    .string("Name must be a character")
    .min(3, "Name has minimum 3 length")
    .max(12, "Name has maximum 12 length")
    .trim(),
});

const signInSchema = z.object({
  email: z.email({ error: "Email is invalid" }).trim(),
  password: z
    .string()
    .regex(
      /(?=.*[@$!%*?&])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)\S{8,}/g,
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    )
    .min(8, "Password Must At Least 8 Length")
    .trim(),
});

const emailSchema = z.object({
  email: z.email({ error: "Email is invalid" }).trim(),
});

const passwordSchema = z.object({
  password: z
    .string()
    .regex(
      /(?=.*[@$!%*?&])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)\S{8,}/g,
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    )
    .min(8, "Password Must At Least 8 Length")
    .trim(),
});

export const signUpValidator = async (data: AuthProps) => {
  const res = signUpSchema.safeParse(data);

  return res;
};

export const signInValidator = async (data: AuthProps) => {
  const res = signInSchema.safeParse(data);

  return res;
};

export const emailValidator = async (data: AuthProps) => {
  const res = emailSchema.safeParse(data);

  return res;
};

export const passwordValidator = async (data: AuthProps) => {
  const res = passwordSchema.safeParse(data);

  return res;
};
