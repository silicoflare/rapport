"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import AES from "@/utils/crypto/AES";
import db from "@/utils/db";
import { userSecrets } from "@/utils/keys";
import { createHash, pbkdf2Sync, randomBytes } from "crypto";

export async function getChat(username: string) {
  // Get the authenticated user ID
  const ID = (await auth())!.user.id;

  // Find the chat secret involving both the authenticated user and the target user
  const chatSecret = await db.chatSecret.findFirst({
    where: {
      chat: {
        ChatSecret: {
          some: {
            user: {
              username, // Target user by username
            },
          },
        },
      },
      userID: ID, // Authenticated user is a participant in the chat
    },
    include: {
      chat: true, // Include chat details if needed
    },
  });

  // Handle the case where no shared chat secret is found
  if (!chatSecret) {
    throw new Error("No chat secret found between the users.");
  }

  // Return the shared secret
  return {
    id: chatSecret.chatID,
    secret: chatSecret.userSecret,
  };
}

export async function getUserData(username: string) {
  const user = await db.user.findFirst({
    where: {
      username,
    },
  });

  return {
    id: user!.id,
    username,
    name: user!.name,
  };
}

export async function sendMessage(username: string, message: string) {
  const ID = (await auth())!.user.id;

  const { id, secret } = await getChat(username);
  const user = await db.user.findFirst({
    where: {
      username,
    },
    include: {
      userSecret: true,
    },
  });

  // get all required stuff for encryption
  const salt = randomBytes(32).toString("base64");
  const msgid = randomBytes(8).toString("hex");
  const ecdh = (await userSecrets())!.ecdh;
  const chat_secret = await ecdh.decrypt(secret);
  const shared = await ecdh
    .compute(Buffer.from(user!.userSecret!.publickey, "base64"))
    .toString("base64");

  // layer 1
  const layer1 = new AES(
    pbkdf2Sync(msgid + chat_secret, salt, 230903, 32, "sha256").toString(
      "base64",
    ),
  );
  const layer1Res = layer1.encrypt(message);

  // layer 2
  const layer2 = new AES(createHash("sha256").update(shared).digest("base64"));
  const layer2Res = layer2.encrypt(layer1Res);

  // create record
  await db.message.create({
    data: {
      id: msgid,
      chatID: id,
      senderID: ID,
      salt,
      msgstore: layer2Res,
    },
  });
}

export interface ActionMessage {
  id: string;
  message: string;
  sender: boolean;
  sentAt: Date;
}

export async function getMessages(username: string) {
  const ID = (await auth())!.user.id;

  // preparing universal keys
  const { id, secret } = await getChat(username);
  const user = await db.user.findFirst({
    where: {
      username,
    },
    include: {
      userSecret: true,
    },
  });

  const ecdh = (await userSecrets())!.ecdh;
  const chat_secret = await ecdh.decrypt(secret);
  const shared = await ecdh
    .compute(Buffer.from(user!.userSecret!.publickey, "base64"))
    .toString("base64");

  const messages: ActionMessage[] = [];

  const messageList = await db.message.findMany({
    where: {
      chatID: id,
    },
    orderBy: {
      sentAt: "asc",
    },
  });

  // Decrypt the messages
  for (const msg of messageList) {
    // layer 2
    const layer2 = new AES(
      createHash("sha256").update(shared).digest("base64"),
    );
    const layer2Res = layer2.decrypt(msg.msgstore);

    // layer 1
    const layer1 = new AES(
      pbkdf2Sync(msg.id + chat_secret, msg.salt, 230903, 32, "sha256").toString(
        "base64",
      ),
    );
    const layer1Res = layer1.decrypt(layer2Res);

    messages.push({
      id: msg.id,
      message: layer1Res,
      sender: msg.senderID === ID,
      sentAt: msg.sentAt,
    });
  }

  return messages;
}
