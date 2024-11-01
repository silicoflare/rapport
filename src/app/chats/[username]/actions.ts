"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import db from "@/utils/db";

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
  return chatSecret.chatID;
}
