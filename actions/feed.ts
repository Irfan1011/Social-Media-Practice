"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

import { requiredSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removeCloudinary } from "@/lib/cloudinary";
import { feedCommentValidator, feedValidator } from "./validator";

export const addFeed = async (prevState: object, formData: FormData) => {
  const data = {
    description: formData.get("description") as string,
    images: formData.get("images")?.toString(),
    videos: formData.get("videos")?.toString(),
  };

  const session = await requiredSession();

  const images = data.images ? JSON.parse(data.images) : [];
  const videos = data.videos ? JSON.parse(data.videos) : [];

  const validator = await feedValidator({
    description: data.description,
    images,
    videos,
  });

  if (!validator.success) {
    if (Array.isArray(images)) {
      for (const image of images) {
        await removeCloudinary(image.public_id as string, "image");
      }
    }

    if (Array.isArray(videos)) {
      for (const video of videos) {
        await removeCloudinary(video.public_id as string, "video");
      }
    }

    return {
      ...prevState,
      status: 400,
      message: z.prettifyError(validator.error),
      data: validator.data,
    };
  }

  await prisma.post.create({
    data: {
      description: validator.data.description,
      images: validator.data.images.map((image) => image.secure_url),
      videos: validator.data.videos.map((video) => video.secure_url),
      user: {
        connect: { email: session.user.email },
      },
    },
  });

  revalidatePath("/");
  return { ...prevState, status: 200, message: "Success", data: [] };
};

export const updateFeed = async (prevState: object, formData: FormData) => {
  const data = {
    id: formData.get("postId") as string,
    description: formData.get("description") as string,
    images: formData.get("images") as string,
    videos: formData.get("videos") as string,
    deletedImages: formData.get("deletedImages") as string,
    deletedVideos: formData.get("deletedVideos") as string,
  };

  const session = await requiredSession();

  const feed = await prisma.post.findFirst({
    where: {
      id: data.id,
    },
  });

  if (!feed) throw new Error("Feed Not Found");

  const updatedImages = [...feed.images];
  const updatedVideos = [...feed.videos];
  const addedImages = data.images ? JSON.parse(data.images) : [];
  const addedVideos = data.videos ? JSON.parse(data.videos) : [];

  const validator = await feedValidator({
    description: data.description,
    images: addedImages,
    videos: addedVideos,
  });

  if (!validator.success) {
    return {
      ...prevState,
      status: 400,
      message: z.prettifyError(validator.error),
      data: validator.data,
    };
  }

  if (addedImages.length > 0) {
    updatedImages.push(
      ...validator.data.images.map((image) => image.secure_url),
    );
  }
  if (addedVideos.length > 0) {
    updatedVideos.push(
      ...validator.data.videos.map((video) => video.secure_url),
    );
  }

  const deletedImages: string[] = JSON.parse(data.deletedImages);
  const deletedVideos: string[] = JSON.parse(data.deletedVideos);
  let filterUpdatedImages = updatedImages;
  let filterUpdatedVideos = updatedVideos;

  try {
    if (deletedImages.length > 0) {
      const images = deletedImages.map((image) =>
        image
          .split("/upload/")[1]
          .replace(/^v\d+\//, "")
          .replace(/\.[^/.]+$/, ""),
      );

      for (const public_id of images) {
        await removeCloudinary(public_id, "image");
      }

      filterUpdatedImages = updatedImages.filter(
        (prevImages) => !deletedImages.includes(prevImages),
      );
    }
    if (deletedVideos.length > 0) {
      const videos = deletedVideos.map((video) =>
        video
          .split("/upload/")[1]
          .replace(/^v\d+\//, "")
          .replace(/\.[^/.]+$/, ""),
      );

      for (const public_id of videos) {
        await removeCloudinary(public_id, "video");
      }

      filterUpdatedVideos = updatedVideos.filter(
        (prevVideos) => !deletedVideos.includes(prevVideos),
      );
    }
  } catch (err) {
    return {
      status: 500,
      message: "Failed to Update Feed",
      data: err,
    };
  }

  await prisma.post.update({
    where: { id: data.id },
    data: {
      description: validator.data.description,
      images: filterUpdatedImages,
      videos: filterUpdatedVideos,
    },
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

  if (!feed) throw new Error("Feed not found");

  if (feed.images) {
    const images = feed.images.map((image) =>
      image
        .split("/upload/")[1]
        .replace(/^v\d+\//, "")
        .replace(/\.[^/.]+$/, ""),
    );

    try {
      for (const public_id of images) {
        await removeCloudinary(public_id, "image");
      }
    } catch (error) {
      console.error("Failed to delete Cloudinary feed image:", error);
    }
  }

  if (feed.videos) {
    const videos = feed.videos.map((video) =>
      video
        .split("/upload/")[1]
        .replace(/^v\d+\//, "")
        .replace(/\.[^/.]+$/, ""),
    );

    try {
      for (const public_id of videos) {
        await removeCloudinary(public_id, "video");
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

export const likeFeed = async (formData: FormData) => {
  const feedId = formData.get("feedId") as string;

  const session = await requiredSession();

  const feed = await prisma.post.findFirst({ where: { id: feedId } });
  if (!feed) throw new Error("Feed Not Found");

  const like = await prisma.like.findFirst({
    where: { postId: feed.id, userId: session.user.id },
  });

  if (like) {
    await prisma.like.delete({ where: { id: like?.id } });

    const notification = await prisma.notification.findFirst({where: {senderId: session.user.id, receiverId: feed.userId, contentId: like.id}})
    
    if (notification) {
      await prisma.notification.delete({
        where: { id: notification.id },
      });
    }
  } else {
    await prisma.like.create({
      data: { userId: session.user.id, postId: feed.id },
    });

    if (feed.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: "LIKE",
          contentId: feed.id,
          senderId: session.user.id,
          receiverId: feed.userId,
        },
      });
    }
  }
};

export const addComment = async (_: unknown, formData: FormData) => {
  const data = {
    feedId: formData.get("feedId") as string,
    comment: formData.get("comment") as string,
    parentId: formData.get("parentId") as string,
  };

  const session = await requiredSession();

  const validator = await feedCommentValidator(data.comment);

  if (!validator.success) {
    return { message: z.prettifyError(validator.error) };
  }

  const feed = await prisma.post.findFirst({ where: { id: data.feedId } });
  if (!feed) throw new Error("Feed Not Found");

  if (data.parentId) {
    const parentId = await prisma.comment.findFirst({
      where: { id: data.parentId },
    });
    if (!parentId) throw new Error("ParentId Comment Not Found");
  }

  const comment = await prisma.comment.create({
    data: {
      userId: session.user.id,
      postId: feed.id,
      comment: validator.data.comment,
      parentId: data.parentId,
    },
    include: {
      user: {
        select: { id: true, username: true, image: true },
      },
    },
  });

  if (feed.userId !== session.user.id) {
    await prisma.notification.create({
      data: {
        type: "COMMENT",
        contentId: comment.id,
        senderId: session.user.id,
        receiverId: feed.userId,
      },
    });
  }

  if (!comment) throw new Error("Failed to add comment");

  return { status: 200, message: "Success to add comment", comment };
};

export const updateComment = async (_: unknown, formData: FormData) => {
  const data = {
    commentId: formData.get("commentId") as string,
    comment: formData.get("comment") as string,
  };

  await requiredSession();

  const validator = await feedCommentValidator(data.comment);
  if (!validator.success) {
    return { message: z.prettifyError(validator.error) };
  }

  const comment = await prisma.comment.findFirst({
    where: { id: data.commentId },
  });
  if (!comment) throw new Error("Comment Not Found");

  const res = await prisma.comment.update({
    where: { id: data.commentId },
    data: { comment: validator.data.comment },
    include: {
      user: {
        select: { id: true, username: true, image: true },
      },
    },
  });

  return { status: 200, message: "Success to update comment", comment: res };
};

export const deleteComment = async (formData: FormData) => {
  const commentId = formData.get("commentId") as string;

  const session = await requiredSession();

  const comment = await prisma.comment.findFirst({ where: { id: commentId } });
  if (!comment) throw new Error("Comment Not Found");

  const notification = await prisma.notification.findFirst({
    where: { senderId: session.user.id, receiverId: comment.userId },
  });

  if (notification) {
    await prisma.notification.delete({ where: { id: notification.id } });
  }

  await deleteCommentTree(comment.id);
};

const deleteCommentTree = async (id: string) => {
  const children = await prisma.comment.findMany({
    where: {
      parentId: id,
    },
  });

  for (const child of children) {
    await deleteCommentTree(child.id);
  }

  await prisma.comment.delete({
    where: { id },
  });
};
