import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db,";
import { compare } from "bcrypt"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


export type UserToken = {
  id: string;
  username: string;
  picture: string;
  isGuest?: boolean;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) return null;
        const { username, password } = credentials;

        const user = await db.user.findFirst({
          where: {
            OR: [{ username: username }, { email: username }],
          },
        });

        if (!user) return null;
        if (user.isGuest) {
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
          (await cookies()).set({
            name: "token",
            value: token,
            httpOnly: true,
            path: "/"
          })
          return {
            id: user.id,
            username: user.username,
            picture: user.picture,
            isGuest: false
          };
        }
        const checkPass = await compare(password, user.password as string);
        if (!checkPass) return null;

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          picture: user.picture,
          isGuest: false
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, trigger, session, user }) {

      if (user) {
        const customUser = user as UserToken
        token.id = customUser.id;
        token.username = customUser.username;
        token.picture = customUser.picture;
        token.isGuest = customUser.isGuest || false;
      }


      if (trigger === "update" && session) {
        token.username = session.username || token.username;
        token.picture = session.picture || token.picture;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        username: token.username as string,
        picture: token.picture as string,
        isGuest: token.isGuest as boolean,
      };
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
};
