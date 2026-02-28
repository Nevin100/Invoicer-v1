import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import connectDB from "@/lib/database/db_connection";
import User from "@/lib/models/User.model";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          const existing = await User.findOne({ email: user.email });
          if (!existing) {
            await User.create({
              username: user.name?.replace(/\s+/g, "").toLowerCase(),
              email: user.email,
              password: null,
              avatar: user.image,
            });
          }
          return true;
        } catch(error : any) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/dashboard`; 
    },

    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.provider = "google";
      }
      return token;
    },

    async session({ session, token }) {
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.image = token.picture as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
});