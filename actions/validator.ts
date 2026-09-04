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

const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .regex(
      /(?=.*[@$!%*?&])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)\S{8,}/g,
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    )
    .min(8, "Password Must At Least 8 Length")
    .trim(),
  currentPassword: z
    .string()
    .regex(
      /(?=.*[@$!%*?&])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)\S{8,}/g,
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    )
    .min(8, "Password Must At Least 8 Length")
    .trim(),
});

const updateUserSchema = z.object({
  name: z.string().min(3).max(20).trim(),
  username: z
    .string()
    .regex(
      /((?=.*\w).\d*){8,}/g,
      "Username must contain at least 8 char long, no special character allowed",
    )
    .trim(),
  description: z.string(),
});

const cloudinaryImageSchema = z.object({
  secure_url: z.url(),
  public_id: z.string().min(1),
  resource_type: z.literal("image"),
});

const cloudinaryVideoSchema = z.object({
  secure_url: z.url(),
  public_id: z.string().min(1),
  resource_type: z.literal("video"),
});

const feedValidatorSchema = z.object({
  description: z.string().trim().min(1, "Description cannot be empty"),
  images: z.array(cloudinaryImageSchema).default([]),
  videos: z.array(cloudinaryVideoSchema).default([]),
});

const feedCommentValidatorSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(255, "Comment cannot be longer than 255 character"),
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

type UpdatePasswordValidatorProps = {
  newPassword: string;
  currentPassword: string;
};

export const updatePasswordValidator = async (
  data: UpdatePasswordValidatorProps,
) => {
  const res = changePasswordSchema.safeParse(data);

  return res;
};

type UpdateUserValidatorProps = {
  name: string;
  username: string;
};

export const updateUserValidator = async (data: UpdateUserValidatorProps) => {
  const res = updateUserSchema.safeParse(data);

  return res;
};

type FeedValidatorProps = z.infer<typeof feedValidatorSchema>;

export const feedValidator = async (data: FeedValidatorProps) => {
  const res = feedValidatorSchema.safeParse(data);

  return res;
};

export const feedCommentValidator = async (comment: string) => {
  const res = feedCommentValidatorSchema.safeParse({ comment });

  return res;
};
