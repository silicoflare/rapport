"use server";

import ECDH from "./crypto/ECDH";
import env from "@/env";
import db from "./db";
import { cookies } from "next/headers";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function userSecrets() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("next-auth.session-token")?.value;

  if (!sessionCookie) {
    return;
  }

  const res = await fetch(`${env.NEXTAUTH_URL}/api/secret`, {
    method: "GET",
    headers: {
      Cookie: `next-auth.session-token=${sessionCookie}`,
    },
    credentials: "include",
  });

  const data = await res.json();

  const ecdh = new ECDH();
  ecdh.setPrivate(Buffer.from(env.SERVER_PRIVATE_KEY, "base64"));

  const payload = JSON.parse(ecdh.decrypt(data)) as Record<
    "user_secret" | "private_key",
    string
  >;

  const userECDH = new ECDH();
  userECDH.setPrivate(Buffer.from(payload.private_key, "base64"));

  return {
    user_secret: payload.user_secret,
    ecdh: userECDH,
  };
}

export async function chatSecrets(chat_id: string) {
  const ecdh = (await userSecrets())?.ecdh;

  const ID = (await auth())!.user.id;

  const secret = await db.chatSecret.findFirst({
    where: {
      userID: ID,
      chatID: chat_id,
    },
  });

  return {
    chat_id,
    chat_secret: ecdh!.decrypt(secret!.userSecret),
  };
}
