import { getServerSession } from "next-auth";
import { auth, authOptions } from "../auth/[...nextauth]/route";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { error } from "console";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const session = await auth();
  const token = await getToken({ req });
  console.log(req.cookies);

  if (!session) {
    return Response.json(
      {
        error: "Not logged in!",
      },
      {
        status: 401,
      }
    );
  }

  return Response.json({
    user: session.user,
    token: token,
  });
}
