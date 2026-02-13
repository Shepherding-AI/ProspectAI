import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

import type { NextAuthConfig } from "next-auth";
import Email from "next-auth/providers/email";

// NOTE: NextAuth Email provider requires a SMTP or compatible transport.
// Here we use Resend via "server" in env, but NextAuth Email provider expects SMTP transport.
// For production, you can switch to a SMTP provider or implement a custom sendVerificationRequest.
// This V1 uses Email provider config shape with `server` + `from`.
const emailProvider = env.RESEND_API_KEY && env.EMAIL_FROM
  ? Email({
      from: env.EMAIL_FROM,
      // Provide SMTP-compatible server if you have one; otherwise set SKIP_ENV_VALIDATION=true and replace.
      // Example (Mailgun/Sendgrid SMTP):
      // server: process.env.SMTP_URL!
      server: process.env.SMTP_URL ?? "",
    })
  : null;

export const authConfig: NextAuthConfig = {
  trustHost: env.AUTH_TRUST_HOST,
  secret: env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: emailProvider ? [emailProvider] : [],
  callbacks: {
    async session({ session, user }) {
      // attach workspaceId for server-side checks
      // @ts-expect-error - augment session in your app as needed
      session.userId = user.id;
      // @ts-expect-error
      session.workspaceId = (user as any).workspaceId;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    verifyRequest: "/signin?checkEmail=1",
  },
  events: {
    async signIn(message) {
      logger.info({ message }, "signIn");
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
