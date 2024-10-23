import env from "@/env"
import AES from "@/utils/crypto/AES"
import db from "@/utils/db"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    username: string;
  }
}


const handler = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          username: token.username
        }
      }
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

        const passAES = new AES(credentials!.password)

        const passphrase = passAES.decrypt(user.phrasestore)

        if (passphrase === env.PASSPHRASE) {
          const data = {
            id: user.id,
            username: user.username,
            name: user.name,
          }
          return data
        }
        return null
      }
    })
  ]
})

export { handler as GET, handler as POST }