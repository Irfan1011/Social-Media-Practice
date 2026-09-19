"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

import { requiredSession } from "@/lib/auth";
import { removeCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { storyValidator } from "./validator";

export const addStory = async (_: unknown, formData: FormData) => {
  const data = {
    image: formData.get("image")?.toString(),
    video: formData.get("video")?.toString(),
  };

  const session = await requiredSession();

  const image = data.image ? JSON.parse(data.image) : "";
  const video = data.video ? JSON.parse(data.video) : "";

  const validator = await storyValidator({ image, video });

  if (!validator.success) {
    if (image.length > 0) {
      await removeCloudinary(image.public_id as string, "image");
    }

    if (video.length > 0) {
      await removeCloudinary(video.public_id as string, "video");
    }

    return {
      status: 400,
      message: z.prettifyError(validator.error),
    };
  }

  const existingStory = await prisma.story.findFirst({
    where: { userId: session.user.id },
  });

  if (existingStory) {
    let existingFile =
      existingStory.image !== null ? existingStory.image : existingStory.video!;

    const public_id = existingFile
      .split("/upload/")[1]
      .replace(/^v\d+\//, "")
      .replace(/\.[^/.]+$/, "");

    await removeCloudinary(
      public_id,
      existingStory.image !== null ? "image" : "video",
    );

    await prisma.story.delete({ where: { id: existingStory.id } });
  }

  await prisma.story.create({
    data: {
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      image:
        validator.data.resource_type === "image"
          ? validator.data.secure_url
          : undefined,
      video:
        validator.data.resource_type === "video"
          ? validator.data.secure_url
          : undefined,
      userId: session.user.id,
    },
  });

  revalidatePath("/");
};

export const deleteStory = async (formData: FormData) => {
  const storyId = formData.get("storyId") as string;

  const session = await requiredSession();

  const existingStory = await prisma.story.findUnique({
    where: { id: storyId, userId: session.user.id },
  });
  if (!existingStory) throw new Error("Story Not Found");

  let existingFile =
    existingStory.image !== null ? existingStory.image : existingStory.video!;

  const public_id = existingFile
    .split("/upload/")[1]
    .replace(/^v\d+\//, "")
    .replace(/\.[^/.]+$/, "");

  await removeCloudinary(
    public_id,
    existingStory.image !== null ? "image" : "video",
  );

  await prisma.story.delete({ where: { id: existingStory.id } });
  revalidatePath("/");
};
