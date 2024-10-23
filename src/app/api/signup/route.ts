import env from "@/env";
import AES from "@/utils/crypto/AES";
import db from "@/utils/db";
import { generatePhrase } from "@/utils/tools";
import { pbkdf2Sync, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, name, password } = await req.json() as Record<string, string>

  const PAK = password
  const recoveryphrase = generatePhrase()
  const RAK = pbkdf2Sync(recoveryphrase, env.AUTH_SALT, 97965, 32, "sha256").toString("base64")

  const user_secret = randomBytes(32).toString('base64')

  const passAES = new AES(PAK)
  const recAES = new AES(RAK)

  const phrasestore = passAES.encrypt(env.PASSPHRASE)
  const recphrasestore = recAES.encrypt(env.PASSPHRASE)
  const keystore = passAES.encrypt(user_secret)
  const recoverystore = recAES.encrypt(user_secret)

  const { id } = await db.user.create({
    data: {
      name,
      username,
      phrasestore,
      recphrasestore
    }
  })

  await db.userSecret.create({
    data: {
      user: {
        connect: {
          id
        }
      },
      keystore,
      recoverystore
    }
  })

  return NextResponse.json({
    id,
    username,
    recoveryphrase
  })
}