import env from "@/env"
import AES from "@/utils/crypto/AES"
import db from "@/utils/db"
import { pbkdf2Sync } from "crypto"
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import NextAuth, { AuthOptions, DefaultSession, DefaultUser, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { config } from "process"

declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: User
  }

  export interface User extends DefaultUser {
    id: string;
    name: string;
    username: string;
    secret: string;
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    id: string;
    name: string;
    username: string;
    secret: string;
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.username = user.username
        token.secret = user.secret
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.username = token.username as string;
        session.user.secret = token.secret as string;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", required: true },
        password: { label: "Password", type: "password", required: true }
      },
      async authorize(credentials, req) {
        const user = await db.user.findFirst({
          where: {
            username: credentials!.username
          }
        })

        if (!user) {
          return null
        }

        const passAES = new AES(pbkdf2Sync(credentials!.password, process.env.NEXT_PUBLIC_AUTH_SALT as string, 97965, 32, "sha256").toString("base64"))

        const passphrase = passAES.decrypt(user.phrasestore)

        if (passphrase === env.PASSPHRASE) {
          const userSecret = await db.userSecret.findFirst({
            where: {
              user_id: user.id
            }
          })

          const secret = new AES(env.SECRET_KEY)

          const data = {
            id: user.id,
            username: user.username,
            name: user.name,
            secret: secret.encrypt(passAES.decrypt(userSecret!.keystore))
          }
          return data
        }
        return null
      }
    })
  ]
}


const handler = NextAuth(authOptions)

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(authOptions)
}


export { handler as GET, handler as POST }