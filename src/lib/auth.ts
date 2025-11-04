import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "./prisma";

// Validate credentials
const credentialsSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const validatedCredentials = credentialsSchema.safeParse(credentials);

          if (!validatedCredentials.success) {
            console.error("Invalid credentials format");
            return null;
          }

          const { username, password } = validatedCredentials.data;

          // Find user
          const user = await prisma.users.findUnique({
            where: {
              username: username,
              deleted: false,
            },
          });

          if (!user) {
            console.error("User not found");
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            console.error("Invalid password");
            return null;
          }

          // Return user object
          return {
            id: user.id,
            name: user.full_name || user.username,
            email: `${user.username}@calendar.app`,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Pages
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Callbacks
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.username = user.email?.split("@")[0] || "admin";
        token.role = "admin";
        token.iat = Math.floor(Date.now() / 1000); // Issued at
        token.exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // Expires in 7 days
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  // Events
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token?.username}`);
    },
  },

  // Security
  secret: process.env.NEXTAUTH_SECRET,

  // Debug mode
  debug: process.env.NODE_ENV === "development",

  // Trust host
  trustHost: true,
});
