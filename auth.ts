import GitHub from "next-auth/providers/github";
import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 60 *60*24, //会话时长（24小时）
    updateAge: 60 * 60, 
  },
  pages: {
    signIn: '/', 
    error: '/Login', 
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
          },
        };
      }
      return session;
    },
  }
});