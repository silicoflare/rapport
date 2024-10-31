"use server";

import db from "@/utils/db";
import { auth } from "../api/auth/[...nextauth]/route";
import { randomBytes } from "crypto";
import { CHAT_STORE, USER_STORE } from "@/utils/keystore";

/**
 * I couldn't give two shits if you think this is GPT generated code because
 * it has too many comments, but you wouldn't get it. This code involves some
 * of the most complicated operations I have written (by myself), so I need the
 * comments so that I don't go blank when I go through this code in the future.
 */

export interface ActionUser {
  id: string;
  name: string;
  username: string;
}

/**
 * Fetch a list of users who are not your contacts
 *
 * @returns a list of users with their public keys
 * @export
 */
export async function getUsers() {
  const ID = (await auth())!.user.id;

  /** Find non contacts */
  // find all users where...
  const nonContacts = await db.user.findMany({
    where: {
      AND: [
        // user is not the current one, and...
        {
          id: { not: ID },
        },
        {
          // none of the chat secrets have a shared chat ID with the current user
          ChatSecret: {
            none: {
              chatID: {
                in: await db.chatSecret
                  .findMany({
                    where: { userID: ID },
                    select: { chatID: true },
                  })
                  .then((chats) => chats.map((cs) => cs.chatID)),
              },
            },
          },
        },
      ],
    },
    include: {
      userSecret: true,
    },
  });

  const users: ActionUser[] = [];

  for (let u of nonContacts) {
    users.push({
      id: u.id,
      name: u.name,
      username: u.username,
    });
  }

  return users;
}

export interface ActionContact {
  id: string;
  username: string;
  name: string;
  chat_id: string;
}

/**
 * Get the current user's contacts
 *
 * @export
 */
export async function getContacts() {
  const ID = (await auth())!.user.id;

  const contacts = await db.user.findMany({
    where: {
      AND: [
        {
          id: {
            not: ID,
          },
        },
        {
          ChatSecret: {
            some: {
              chatID: {
                in: (
                  await db.chatSecret.findMany({
                    where: {
                      userID: ID,
                    },
                    select: {
                      chatID: true,
                    },
                  })
                ).map((cs) => cs.chatID),
              },
            },
          },
        },
      ],
    },
    include: {
      ChatSecret: true,
    },
  });

  const contactlist: ActionContact[] = [];

  for (let c of contacts) {
    contactlist.push({
      id: c.id,
      name: c.name,
      username: c.username,
      chat_id: c.ChatSecret.find((c) => c.userID === ID)?.chatID ?? "",
    });
  }

  return contactlist;
}

export async function addContact(id: string) {
  const ID = (await auth())!.user.id;

  // get current user's public key
  const pubkey = Buffer.from(
    (await db.user.findFirst({
      where: {
        id: ID,
      },
      select: {
        userSecret: true,
      },
    }))!.userSecret!.publickey,
    "base64"
  );

  // get other user
  const otherUser = await db.user.findFirst({
    where: {
      id,
    },
    select: {
      userSecret: true,
    },
  });

  // generate a chat secret to use
  const chat_secret = randomBytes(32).toString("base64");

  // create a new chat
  const createdChatID = (await db.chat.create({})).id;

  // get current user's ECDH object
  const ecdh = USER_STORE.get(ID)!.ecdh;

  // encrypt chat secrets for both users
  await db.chatSecret.create({
    data: {
      userID: ID,
      chatID: createdChatID,
      userSecret: ecdh.encrypt(chat_secret, pubkey),
    },
  });
  await db.chatSecret.create({
    data: {
      userID: id,
      chatID: createdChatID,
      userSecret: ecdh.encrypt(
        chat_secret,
        Buffer.from(otherUser!.userSecret!.publickey, "base64")
      ),
    },
  });

  return { message: "Created contact successfully!" };
}
