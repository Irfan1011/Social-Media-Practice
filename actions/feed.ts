"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

import { requiredSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  uploadStreamCloudinary,
  removeCloudinaryImage,
} from "@/lib/cloudinary";
import { descriptionFeedValidator } from "./validator";

export const addFeed = async (prevState: object, formData: FormData) => {
  const description = formData.get("description") as string;
  const images = formData.getAll("images") as File[];
  const videos = formData.getAll("videos") as File[];

  const session = await requiredSession();

  const validator = await descriptionFeedValidator(description);

  if (!validator.success) {
    return {
      ...prevState,
      status: 400,
      message: z.prettifyError(validator.error),
      data: validator.data,
    };
  }

  const imagesFile = images.filter((image) => image.size > 0);
  const videosFile = videos.filter((video) => video.size > 0);
  const imagesUrl: string[] = [];
  const videosUrl: string[] = [];

  if (imagesFile.length > 0 || videosFile.length > 0) {
    try {
      const urls = await Promise.all(
        images.map(async (image) => {
          const arrayBuffer = await image.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          //upload to cloudinary
          const res = await uploadStreamCloudinary(buffer, "feeds");

          return res.secure_url;
        }),
      );

      imagesUrl.push(...urls);
    } catch (err) {
      console.error("Failed to update profile image", err);
    }
  }

  const data = {
    description,
    images: imagesUrl,
    videos: videosUrl,
  };

  await prisma.post.create({
    data: {
      ...data,
      user: {
        connect: { email: session.user.email },
      },
    },
  });

  revalidatePath("/");
  return { ...prevState, status: 200, message: "Success", data: [] };
};

export const updateFeed = async (prevState: object, formData: FormData) => {
  const id = formData.get("postId") as string;
  const description = formData.get("description") as string;
  const images = formData.getAll("images") as File[];
  const videos = formData.getAll("videos") as File[];

  const session = await requiredSession();

  const validator = await descriptionFeedValidator(description);

  if (!validator.success) {
    return {
      ...prevState,
      status: 400,
      message: z.prettifyError(validator.error),
      data: validator.data,
    };
  }

  const feed = await prisma.post.findFirst({
    where: {
      id: id,
    },
  });

  if (!feed) throw new Error("Feed Not Found");

  const imagesUrl: string[] = [];
  const videosUrl: string[] = [];

  if ((images.length > 0 && feed.images.length > 0) || videos.length > 0) {
    const images_public_id = feed.images.map((image) =>
      image
        .split("/upload/")[1]
        .replace(/^v\d+\//, "")
        .replace(/\.[^/.]+$/, ""),
    );

    try {
      for (const public_id of images_public_id) {
        await removeCloudinaryImage(public_id);
      }

      const urls = await Promise.all(
        images.map(async (image) => {
          const arrayBuffer = await image.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          //upload to cloudinary
          const res = await uploadStreamCloudinary(buffer, "feeds");

          return res.secure_url;
        }),
      );

      imagesUrl.push(...urls);
    } catch (error) {
      console.error("Failed to update profile image", error);
    }
  }

  const data = {
    description,
    images: imagesUrl,
    videos: videosUrl,
  };

  await prisma.post.update({
    where: { id: id },
    data: data,
  });

  revalidatePath(`/${session.user.username}`);
  return { ...prevState, status: 200, message: "Success", data: [] };
};

export const deleteFeed = async (formData: FormData) => {
  const feedId = formData.get("feedId") as string;

  const session = await requiredSession();

  const feed = await prisma.post.findFirst({
    where: {
      id: feedId,
    },
  });

  if (feed?.images) {
    const images = feed.images.map((image) =>
      image
        .split("/upload/")[1]
        .replace(/^v\d+\//, "")
        .replace(/\.[^/.]+$/, ""),
    );

    try {
      for (const public_id of images) {
        await removeCloudinaryImage(public_id);
      }
    } catch (error) {
      console.error("Failed to delete Cloudinary feed image:", error);
    }
  }

  await prisma.post.delete({
    where: {
      id: feedId,
    },
  });

  revalidatePath(`/${session.user.username}`);
};
