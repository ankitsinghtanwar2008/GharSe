import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../models/User";
import connectDB from "@/lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      async authorize(credentials) {
        try {
          await connectDB();

          // ✅ Check input
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password required");
          }

          // ✅ Find user
          const user = await User.findOne({
            email: credentials.email,
          });

          if (!user) {
            throw new Error("User not found");
          }

          // ✅ Compare hashed password
          const isMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isMatch) {
            throw new Error("Invalid password");
          }

          // ✅ Return user object
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Auth Error:", error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login", // optional custom login page
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };