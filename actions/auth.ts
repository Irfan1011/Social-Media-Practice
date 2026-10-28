"use server";

import * as z from "zod";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth, requiredSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadStreamCloudinary, removeCloudinary } from "@/lib/cloudinary";
import {
  signUpValidator,
  signInValidator,
  emailValidator,
  passwordValidator,
  updatePasswordValidator,
  updateUserValidator,
} from "./validator";

export const signUpAction = async (prevState: object, formData: FormData) => {
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
        name: data.name
      }
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: validator.data.email,
    },
  });

  if (user) {
    return {
      ...prevState,
      errors: { email: "Email Already Exist" },
      values: {
        email: validator.data.email,
        password: validator.data.password,
        name: validator.data.name,
      },
    };
  }

  await auth.api.signUpEmail({
    body: {
      email: validator.data.email,
      password: validator.data.password,
      name: validator.data.name,
      username: validator.data.email
    },
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
    body: validator.data,
  });

  redirect("/");
};

export const signOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/");
};

export const sendForgetPassword = async (
  prevState: object,
  formData: FormData,
) => {
  const email = formData.get("email") as string;

  const validator = await emailValidator({ email });

  if (!validator.success) {
    const err = z.prettifyError(validator.error);

    return {
      ...prevState,
      success: validator.success,
      message: err.split("→")[0],
    };
  }

  await auth.api.requestPasswordReset({
    body: {
      email: email,
      redirectTo: `${process.env.BETTER_AUTH_URL}/reset-password`,
    },
  });

  return {
    ...prevState,
    success: true,
    message: "Reset Password Sent, Check Your Email",
  };
};

export const resetPassword = async (prevState: object, formData: FormData) => {
  const newPassword = formData.get("newPassword") as string;
  const token = formData.get("token") as string;

  const validator = await passwordValidator({ password: newPassword });

  if (!validator.success) {
    const err = z.prettifyError(validator.error);

    return {
      ...prevState,
      success: validator.success,
      message: err.split("→")[0],
    };
  }

  await auth.api.resetPassword({
    body: {
      newPassword: validator.data.password,
      token,
    },
  });

  redirect("/signin");
};

export const updatePassword = async (_: unknown, formData: FormData) => {
  const newPassword = formData.get("newPassword") as string;
  const currentPassword = formData.get("currentPassword") as string;
  const username = formData.get("username") as string;

  const validator = await updatePasswordValidator({
    newPassword: newPassword,
    currentPassword: currentPassword,
  });

  if (!validator.success) {
    const err = z.prettifyError(validator.error);

    return err;
  }

  await auth.api.changePassword({
    body: {
      newPassword: validator.data.newPassword,
      currentPassword: validator.data.currentPassword,
      revokeOtherSessions: true,
    },
    headers: await headers(),
  });

  redirect(`/${username}/setting`);
};

export const updateUserData = async (_: unknown, formData: FormData) => {
  const data = {
    name: formData.get("name") as string,
    username: formData.get("username") as string,
    description: formData.get("description") as string,
  };

  const session = await requiredSession();

  const validator = await updateUserValidator(data);

  if (!validator.success) {
    const err = z.prettifyError(validator.error);

    return err;
  }

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      ...data,
    },
  });

  revalidatePath(`/${data.username}`);
  redirect(`/${data.username}`);
};

export const updateUserImage = async (formData: FormData) => {
  const image = formData.get("image") as File;

  if (!(image instanceof File)) {
    throw new Error("Image is required");
  }

  const session = await requiredSession();

  const imageInCloudinary = session.user.image?.includes(
    "https://res.cloudinary.com",
  );

  if (session.user.image && imageInCloudinary) {
    const public_id = session.user.image
      .split("/upload/")[1]
      .replace(/^v\d+\//, "")
      .replace(/\.[^/.]+$/, "");

    try {
      // Delete the old Cloudinary image
      await removeCloudinary(public_id, "image");
    } catch (error) {
      console.error("Failed to delete old Cloudinary image:", error);
    }
  }

  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    //upload image to cloudinary cloud storage
    const result = await uploadStreamCloudinary(buffer, "profile", "image");

    //Update image url in database
    await prisma.user.update({
      where: { email: session.user.email },
      data: { image: result.secure_url },
    });
  } catch (err) {
    console.error("Failed to update profile image", err);
  }

  revalidatePath(`/${session?.user.username}`);
};

export const deleteAccount = async (formData: FormData) => {
  const email = formData.get("email") as string;

  const user = await prisma.user.findFirst({ where: { email: email } });

  if (!user) throw new Error("User Not Found");

  const userPosts = await prisma.post.findMany({ where: { userId: user.id } });

  const images = userPosts
    .map((post) => post.images)
    .filter((image) => image.length > 0)
    .map((images) =>
      images.map((image) =>
        image
          .split("/upload/")[1]
          .replace(/^v\d+\//, "")
          .replace(/\.[^/.]+$/, ""),
      ),
    );

  try {
    if (images.length > 0) {
      await Promise.all(
        images.map(async (image) => {
          for (const public_id of image) {
            await removeCloudinary(public_id, "image");
          }
        }),
      );
    }

    if (user.image?.includes("https://res.cloudinary.com")) {
      const public_id = user.image
        .split("/upload/")[1]
        .replace(/^v\d+\//, "")
        .replace(/\.[^/.]+$/, "");

      await removeCloudinary(public_id, "image");
    }
  } catch (error) {
    console.error("Failed to delete Cloudinary user images:", error);
  }

  await prisma.user.delete({
    where: { email: email },
  });

  revalidatePath("/");
  redirect("/");
};

export const followAccount = async (formData: FormData) => {
  const username = formData.get("username") as string;

  const session = await requiredSession();

  const followedBy = session.user.id;
  const followToUserId = (
    await prisma.user.findFirst({
      where: { username: username },
    })
  )?.id;

  if (username.trim().length <= 0 || !followToUserId)
    throw new Error("Username Not Exist To Follow");

  const isFollowed = await prisma.follower.findFirst({
    where: { followerId: followToUserId, followingId: followedBy },
  });

  if (isFollowed) {
    await prisma.follower.delete({
      where: { id: isFollowed.id },
    });

    const notification = await prisma.notification.findFirst({where: {senderId: followedBy, receiverId:followToUserId, contentId: followToUserId}})
    
    if(notification) {
      await prisma.notification.delete({ where: { id: notification.id } });
    }
  } else {
    await prisma.follower.create({
      data: {
        followerId: followToUserId,
        followingId: followedBy,
      },
    });

    await prisma.notification.create({
      data: {
        type: "FOLLOW",
        contentId: followToUserId,
        senderId: followedBy,
        receiverId: followToUserId,
      },
    });
  }

  revalidatePath(`/${username}`);
};

export const blockAccount = async (formData: FormData) => {
  const userId = formData.get("userId") as string;
  const username = formData.get("username") as string;

  const session = await requiredSession();

  const isBlocked = await prisma.block.findFirst({
    where: { blockToId: userId, blockedById: session.user.id },
  });

  if (isBlocked) {
    await prisma.block.delete({ where: { id: isBlocked.id } });
  } else {
    const following = await prisma.follower.findFirst({
      where: { followingId: session.user.id, followerId: userId },
    });
    if (following) {
      await prisma.follower.delete({
        where: { id: following.id },
      });
    }

    await prisma.block.create({
      data: {
        blockedById: session.user.id,
        blockToId: userId,
      },
    });
  }

  revalidatePath(`/${username}`);
};
