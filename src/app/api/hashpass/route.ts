import { encrypt } from "@/utils/crypto/rsa";
import { pbkdf2Sync } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json() as Record<string, string>
  return NextResponse.json({ password: pbkdf2Sync(password, process.env.NEXT_PUBLIC_AUTH_SALT as string, 97965, 32, "sha256").toString("base64") })
}