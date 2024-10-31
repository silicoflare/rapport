"use server";

import env from "@/env";
import AES from "@/utils/crypto/AES";
import ECDH from "@/utils/crypto/ECDH";
import db from "@/utils/db";
import { generatePhrase } from "@/utils/tools";
import { pbkdf2Sync, randomBytes } from "crypto";

export default async function signup(
  name: string,
  username: string,
  password: string
) {
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

  const user_secret = randomBytes(32).toString("base64");
  const ecdh = new ECDH();

  const passAES = new AES(PAK);
  const recAES = new AES(RAK);
  const secretAES = new AES(user_secret);

  const phrasestore = passAES.encrypt(env.PASSPHRASE);
  const recphrasestore = recAES.encrypt(env.PASSPHRASE);
  const keystore = passAES.encrypt(user_secret);
  const recoverystore = recAES.encrypt(user_secret);
  const privatestore = secretAES.encrypt(ecdh.getPrivate("base64"));

  const user = await db.user.create({
    data: {
      name,
      username,
      phrasestore,
      recphrasestore,
    },
  });

  const userSecret = await db.userSecret.create({
    data: {
      keystore,
      recoverystore,
      privatestore,
      publickey: ecdh.getPublic("base64"),
      user: {
        connect: {
          id: user.id,
        },
      },
      user_id: user.id,
    },
  });

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      userSecret: {
        connect: {
          id: userSecret.id,
        },
      },
    },
  });

  return { recoveryphrase };
}
