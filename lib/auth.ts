import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { after } from "next/server";

import VerifyEmail from "@components/email/verify-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    onExistingUserSignUp: async ({ user }) => {
      resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Sign-up attempt with your email",
        text: "Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.",
      });
    },
    sendResetPassword: async ({ user, url }) => {
      resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset Your Password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 600000,
    sendVerificationEmail: async ({ user, url }) => {
      const html = await render(VerifyEmail({ user, url }));

      after(
        resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: user.email,
          subject: "Verify your email address",
          html: html,
        }),
      );
    },
  },
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
