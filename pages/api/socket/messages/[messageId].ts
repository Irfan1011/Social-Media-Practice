import type { Server as HTTPServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removeCloudinary } from "@/lib/cloudinary";

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
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { content, messageId, conversationId } = req.body;

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

    let message = await prisma.message.findFirst({
      where: { id: messageId, senderId: session.user.id },
    });

    if (!message) return res.status(404).json({ message: "Message Not Found" });
    let action;

    if (req.method === "PATCH") {
      action = "PATCH";
      message = await prisma.message.update({
        where: { id: message.id },
        data: { content },
      });
    }

    if (req.method === "DELETE") {
      if (message.fileUrl.length > 0) {
        for (const file of message.fileUrl) {
          const public_id = file
            .split("/upload/")[1]
            .replace(/^v\d+\//, "")
            .replace(/\.[^/.]+$/, "");
          const resource_type = file.split("/upload/")[0].split("/")[4] as
            "image" | "video";

          await removeCloudinary(public_id, resource_type);
        }
      }
      action = "DELETE";
      message = await prisma.message.delete({ where: { id: message.id } });
    }

    if (!action) return res.status(422).json({ message: "Action Undefined" });

    const key = `chat:${conversationId}:messages`;

    const io = res.socket.server.io;

    if (io) io.emit(key, { action, message });

    return res
      .status(200)
      .json({ message: "Success Edit Message", data: message });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal Server API Error", error: err });
  }
}
