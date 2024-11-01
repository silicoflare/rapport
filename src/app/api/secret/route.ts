import env from "@/env";
import ECDH from "@/utils/crypto/ECDH";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  const ecdh = new ECDH();
  ecdh.setPrivate(Buffer.from(env.SERVER_PRIVATE_KEY, "base64"));

  return NextResponse.json(
    ecdh.encrypt(
      JSON.stringify({
        user_secret: token?.user_secret,
        private_key: token?.private_key,
      }),
      Buffer.from(env.SERVER_PUBLIC_KEY, "base64")
    )
  );
}
