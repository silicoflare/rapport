import env from "@/env";
import { pbkdf2Sync } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json() as Record<string, string>
  console.log(env.AUTH_SALT)
  console.log(env.AUTH_SALT)
  console.log(env.AUTH_SALT)
  console.log(env.AUTH_SALT)
  // return NextResponse.json({ password: pbkdf2Sync(password, env.AUTH_SALT, 97965, 32, "sha256").toString("base64") })
}