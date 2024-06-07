import type { NextAuthOptions } from "next-auth";
import Authentik from "next-auth/providers/authentik";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { DatabaseClient } from "@/lib/database";

export const authOptions: NextAuthOptions = {
  // @ts-expect-error
  adapter: PrismaAdapter(DatabaseClient),
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET as string,
  },
  providers: [
    Authentik({
      clientId: process.env.AUTHENTIK_CLIENT_ID as string,
      clientSecret: process.env.AUTHENTIK_CLIENT_SECRET as string,
      wellKnown: process.env.AUTHENTIK_WELL_KNOWN as string,
      authorization: {
        params: {
          scope: "openid profile email abi",
        },
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.role = token.userRole;

      return session;
    },
    async jwt({ token, user, profile }) {
      if (!user || !profile) {
        return token;
      }

      // @ts-expect-error
      token.userRole = user.role;
      token.userId = user.id;

      return token;
    },

    async signIn({ user, profile }) {
      //@ts-expect-error
      if (!user["credits"]) {
        return true;
      }

      //@ts-expect-error
      let IsRoleUpdateNeeded = user["role"] != profile["role"];
      if (IsRoleUpdateNeeded) {
        await DatabaseClient.user.update({
          where: { id: user.id },
          // @ts-expect-error
          data: { role: profile["role"] },
        });
      }

      return true;
    },
  },
};
