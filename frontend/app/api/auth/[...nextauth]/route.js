import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../models/User";
import connectDB from "@/lib/db";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({
          email: credentials.email,
          password: credentials.password,
        });

        if (!user) return null;

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, 
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; 
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role; 
      session.user.id = token.id;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
