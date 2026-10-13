import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: ServerIO;
    };
  };
};

const ioHandler = (_req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
