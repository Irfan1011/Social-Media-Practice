import type { Server as HTTPServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removeCloudinary } from "@/lib/cloudinary";
import { postMessageValidator } from "@actions/validator";

type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: ServerIO;
    };
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { content, fileUrl, conversationId } = req.body;

    const headersList = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          headersList.append(key, item);
        }
      } else if (value !== undefined) {
        headersList.set(key, value);
      }
    }

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session) return res.status(401).json({ message: "Session Missing" });

    const validator = await postMessageValidator({
      message: content,
      fileUrl,
    });

    if (!validator.success) {
      await Promise.all(
        fileUrl.filter(
          (file: { public_id: string; resource_type: "image" | "video" }) =>
            removeCloudinary(file.public_id, file.resource_type),
        ),
      );

      return res.status(400).json({
        error: validator.error,
        data: validator.data,
      });
    }

    const message = await prisma.message.create({
      data: {
        content: validator.data.message,
        fileUrl: validator.data.fileUrl.map((file) => file.secure_url),
        conversationId,
        senderId: session.user.id,
      },
    });

    const key = `chat:${conversationId}:messages`;

    const io = res.socket.server.io;

    if (io) io.emit(key, message);

    return res
      .status(200)
      .json({ message: "Success Send Message", data: message });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal Server API Error", error: err });
  }
}
