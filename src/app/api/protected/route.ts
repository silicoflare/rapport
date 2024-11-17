import { auth } from "../auth/[...nextauth]/auth";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const session = await auth();
  const token = await getToken({ req });

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
