import { Server as NetServer, Socket as NetSocket } from "net";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { postMessageValidator } from "@actions/validator";

type NextApiResponseServerIO = NextApiResponse & {
  socket: NetSocket & {
    server: NetServer & {
      io: ServerIO;
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

    if (!content) return res.status(400).json({ message: "Content Missing" });

    const validator = await postMessageValidator({
      message: content,
      fileUrl: JSON.stringify(fileUrl),
    });

    if (!validator.success) {
      return res.status(400).json({
        error: validator.error,
        data: validator.data,
      });
    }

    const message = await prisma.message.create({
      data: {
        content,
        fileUrl,
        conversationId,
        senderId: session.user.id,
      },
    });

    const key = `chat:${conversationId}:messages`;

    res.socket.server.io.emit(key, message);

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
