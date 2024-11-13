"use server";
import env from "@/env";
import AES from "@/utils/crypto/AES";
import db from "@/utils/db";
import { generatePhrase } from "@/utils/tools";
import { pbkdf2Sync } from "crypto";

export async function recoverAccount(username: string, recphrase: string) {
  try {
    const user = await db.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      return 404;
    }

    const RAK = pbkdf2Sync(
      recphrase,
      env.AUTH_SALT,
      97965,
      32,
      "sha256"
    ).toString("base64");

    const recAES = new AES(RAK);

    const passphrase = recAES.decrypt(user.recphrasestore);

    if (passphrase === env.PASSPHRASE) {
      return 200;
    } else {
      return 401;
    }
  } catch (err) {
    return 401;
  }
}

export async function resetPassword(
  username: string,
  recphrase: string,
  password: string
) {
  const user = await db.user.findFirst({
    where: {
      username,
    },
    include: {
      userSecret: true,
    },
  });

  if (!user) {
    return { status: 404, message: "User not found!" };
  }

  const oldRAK = pbkdf2Sync(
    recphrase,
    env.AUTH_SALT,
    97965,
    32,
    "sha256"
  ).toString("base64");

  const oldRecAES = new AES(oldRAK);

  const user_secret = oldRecAES.decrypt(user.userSecret!.recoverystore);

  const PAK = pbkdf2Sync(password, env.AUTH_SALT, 97965, 32, "sha256").toString(
    "base64"
  );
  const recoveryphrase = generatePhrase();
  const RAK = pbkdf2Sync(
    recoveryphrase,
    env.AUTH_SALT,
    97965,
    32,
    "sha256"
  ).toString("base64");

  const passAES = new AES(PAK);
  const recAES = new AES(RAK);

  const phrasestore = passAES.encrypt(env.PASSPHRASE);
  const recphrasestore = recAES.encrypt(env.PASSPHRASE);
  const keystore = passAES.encrypt(user_secret);
  const recoverystore = recAES.encrypt(user_secret);

  await db.user.update({
    where: {
      username,
    },
    data: {
      phrasestore,
      recphrasestore,
      userSecret: {
        update: {
          keystore,
          recoverystore,
        },
      },
    },
  });

  return { status: 200, message: recoveryphrase };
}
