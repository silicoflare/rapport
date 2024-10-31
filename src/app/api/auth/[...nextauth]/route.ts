import env from "@/env";
import { ChatState } from "@/types";
import AES from "@/utils/crypto/AES";
import ECDH from "@/utils/crypto/ECDH";
import db from "@/utils/db";
import { CHAT_STORE, USER_STORE } from "@/utils/keystore";
import { pbkdf2Sync } from "crypto";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import NextAuth, {
  AuthOptions,
  DefaultSession,
  DefaultUser,
  getServerSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { config } from "process";

declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      username: string;
    };
  }

  export interface User extends DefaultUser {
    id: string;
    name: string;
    username: string;
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    id: string;
    name: string;
    username: string;
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const chats = await db.chatSecret.findMany({
          where: {
            userID: user.id,
          },
        });

        const userSecret = await db.userSecret.findFirst({
          where: {
            user: {
              id: user.id,
            },
          },
        });

        const secret = new AES(USER_STORE.get(user.id)!.user_secret as string);
        const privatekey = secret.decrypt(userSecret!.privatestore);
        const ecdh = new ECDH();
        ecdh.setPrivate(Buffer.from(privatekey, "base64"));

        const chatSecrets: Record<string, ChatState> = {};
        for (let chat of chats) {
          const otherUser = await db.user.findFirst({
            where: {
              AND: [
                {
                  id: user.id,
                },
                {
                  ChatSecret: {
                    some: {
                      chatID: chat.chatID,
                    },
                  },
                },
              ],
            },
            include: {
              userSecret: true,
            },
          });

          const chatstate: ChatState = {
            chat_secret: ecdh.decrypt(chat.userSecret),
            shared_key: ecdh
              .compute(Buffer.from(otherUser!.userSecret!.publickey, "base64"))
              .toString("base64"),
          };

          chatSecrets[chat.chatID] = chatstate;
        }

        CHAT_STORE.set(user.id, chatSecrets);

        token.id = user.id;
        token.name = user.name;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials, req) {
        const user = await db.user.findFirst({
          where: {
            username: credentials!.username,
          },
          include: {
            userSecret: true,
          },
        });

        if (!user) {
          return null;
        }

        const passAES = new AES(
          pbkdf2Sync(
            credentials!.password,
            process.env.NEXT_PUBLIC_AUTH_SALT as string,
            97965,
            32,
            "sha256"
          ).toString("base64")
        );

        const passphrase = passAES.decrypt(user.phrasestore);

        if (passphrase === env.PASSPHRASE) {
          const userSecret = passAES.decrypt(user.userSecret!.keystore);
          const ecdh = new ECDH();
          ecdh.setPrivate(
            Buffer.from(
              new AES(userSecret).decrypt(user.userSecret!.privatestore),
              "base64"
            )
          );
          USER_STORE.set(user.id, {
            user_secret: userSecret,
            ecdh,
          });

          const data = {
            id: user.id,
            username: user.username,
            name: user.name,
          };
          return data;
        }
        return null;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(authOptions);
}

export { handler as GET, handler as POST };
