import axios from "axios";
import NextAuth, { CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthGoogleID, AuthGoogleSecret } from "./config";
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    isVerified?: boolean;
    hasOrganization: boolean;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    isVerified?: boolean;
    hasOrganization?: boolean;
  }
}
class CustomError extends CredentialsSignin {
  constructor(message: string) {
    super();
    this.code = message;
  }
}

// console.log(AuthGoogleSecret);

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: AuthGoogleID,
      clientSecret: AuthGoogleSecret,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailAddress: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("CREDENTIALS:", credentials);

          const response = await axios.post(
            "http://localhost:8000/auth/login",
            {
              emailAddress: credentials?.emailAddress,
              password: credentials?.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          // console.log('RESPONSE:', response);
          // console.log('RESPONSE-STATUS:', response.status);
          const data = response.data;
          console.log(data);

          // console.log('DATA:', response.data);
          // console.log(data?.userInfo?.name);
          // Ensure tokens are included in the returned object
          if (data?.accessToken) {
            console.log(data);
            return {
              emailAddress: credentials.emailAddress,
              name: data?.userInfo?.name,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              isVerified: data?.userInfo?.isVerified,
              hasOrganization: data?.userInfo?.hasOrganization,
            } as any;
          }

          return false; // Login failed
        } catch (error: any) {
          console.log("error", error.response.status);
          if (error.response.status === 400){
            throw new CustomError("Invalid credentials");
          }
          // console.error('Error during credential login:', error);
          else if (error.response.status === 404) {
            throw new CustomError("User not found");
          }
          // return false;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session, user, account }) {
      ///update data when needed
      if (trigger === "update") {
        if (session.isVerified !== undefined) {
          token.isVerified = session.isVerified;
        }
        if (session.hasOrganization !== undefined) {
          token.hasOrganization = session.hasOrganization;
        }
      }
      // Merge tokens for both Google and Credential-based logins

      if (user) {
        console.log("SESSION FLOW");
        token.accessToken = user.accessToken || token.accessToken;
        token.refreshToken = user.refreshToken || token.refreshToken;
        token.isVerified = user.isVerified as boolean;
        token.hasOrganization = user.hasOrganization as boolean;
      }

      if (account && account.provider === "google") {
        // Google login flow
        // console.log("FOUND GOOGLE AUTH FLOW");
        const response = await axios.post(
          "http://localhost:8000/auth/social-login",
          {
            idToken: account.id_token,
            provider: "google",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("DATA:", response.data);
        token.accessToken = response.data?.accessToken;
        token.refreshToken = response.data?.refreshToken;
      }

      return token;
    },
    async session({ trigger, session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.isVerified = token.isVerified as boolean;
      session.hasOrganization = token.hasOrganization as boolean;
      // console.log('SESSION ACTIVATED: ' + session.accessToken);
      // console.log(session);
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl + "/dashboard";
    },
  },
});
