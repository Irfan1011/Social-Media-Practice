"use server";

import { prisma } from "./prisma";

const findConversation = async (userOne: string, userTwo: string) => {
  return await prisma.conversation.findFirst({
    where: {
      AND: [{ userOneId: userOne }, { userTwoId: userTwo }],
    },
    include: {
      userOne: true,
      userTwo: true,
    },
  });
};

const createConversation = async (userOne: string, userTwo: string) => {
  return await prisma.conversation.create({
    data: { userOneId: userOne, userTwoId: userTwo },
  });
};

export const findOrCreateConversation = async (
  userOne: string,
  userTwo: string,
) => {
  const conversation =
    (await findConversation(userOne, userTwo)) ||
    (await findConversation(userTwo, userOne));

  if (!conversation) return await createConversation(userOne, userTwo);

  return conversation;
};
