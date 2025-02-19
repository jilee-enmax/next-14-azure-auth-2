import CredentialsProvider from "next-auth/providers/credentials";
import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import type { NextAuthConfig } from "next-auth";
import { signInWithNativeAuthAPI } from "@/services/nativeAuth";

// ✅ Helper function to decode JWT safely
function parseJwt(token: string) {
  try {
    if (!token) throw new Error("No token provided");
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("Invalid JWT format");

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));

    console.log("✅ Decoded JWT:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Failed to parse JWT:", error);
    return null;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Username & Password",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter your username" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.error("❌ Missing username or password.");
          throw new Error("CredentialsSignin");
        }

        const username = String(credentials.username).trim();
        const password = String(credentials.password).trim();

        console.log("🔄 Attempting to authenticate:", username);

        try {
          const authResponse = await signInWithNativeAuthAPI(username, password);
          console.log("🔄 Backend Response:", authResponse);

          if (!authResponse || !authResponse.accessToken) {
            console.error("❌ Authentication failed. Response:", authResponse);
            throw new Error("Invalid credentials.");
          }

          console.log(`✅ Authenticated: ${authResponse.name} (${authResponse.email})`);

          // ✅ Extract scopes from the access token
          const decodedToken = parseJwt(authResponse.accessToken);
          const scopes = decodedToken?.scp ? decodedToken.scp.split(" ") : [];

          return {
            id: username,
            name: authResponse.name, // ✅ Store name
            email: authResponse.email, // ✅ Store email
            accessToken: authResponse.accessToken,
            refreshToken: authResponse.refreshToken ?? "",
            accessTokenExpires: Date.now() + (authResponse.expiresIn ?? 3600) * 1000,
            scopes, // ✅ Include scopes
          };
        } catch (error) {
          console.error("❌ Authentication error:", error);
          throw new Error("CredentialsSignin");
        }
      },
    }),

    MicrosoftEntraID({
      clientId: process.env.NEXT_AUTH_MICROSOFT_ENTRA_ID_ID ?? "", // ✅ Fix for the error
      clientSecret: process.env.NEXT_AUTH_MICROSOFT_ENTRA_ID_SECRET ?? "", // ✅ Fix for the error
      issuer: `https://${process.env.NEXT_AUTH_MICROSOFT_ENTRA_ID_ISSUER}.ciamlogin.com/${process.env.NEXT_AUTH_MICROSOFT_ENTRA_ID_ISSUER}/v2.0`,
      authorization: {
        params: { scope: "openid profile email offline_access" },
      },
    }),

    GoogleProvider({
      clientId: process.env.NEXT_AUTH_GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.NEXT_AUTH_GOOGLE_CLIENT_SECRET ?? "",
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    }),

    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID ?? "",
      clientSecret: process.env.APPLE_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken ?? token.accessToken;
        token.refreshToken = user.refreshToken ?? token.refreshToken;
        token.name = user.name ?? token.name ?? "";
        token.email = user.email ?? token.email ?? "";
        token.provider = account?.provider ?? token.provider ?? "native";
        token.scopes = user.scopes ?? [];
      }
    
      if (account) {
        token.accessToken = account.access_token ?? token.accessToken;
        token.refreshToken = account.refresh_token ?? token.refreshToken;
        token.provider = account.provider ?? "unknown";
        token.scopes = account.scope ? account.scope.split(" ") : [];
      } else if (token.accessToken) {
        // ✅ Decode accessToken to extract additional info
        const decodedToken = parseJwt(token.accessToken);
        token.scopes = decodedToken?.scp ? decodedToken.scp.split(" ") : [];
      } else if (!token.scopes) {
        token.scopes = [];
      }
    
      console.log("🔍 JWT Callback - Token:", token);
      console.log("🔍 JWT Callback - Scopes:", token.scopes);
      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.name = token.name ?? "Unknown User";
      session.user.email = token.email ?? "Email not available";
      session.user.provider = token.provider ?? "unknown";
      session.user.scopes = token.scopes ?? [];

      console.log("🔍 Session Callback - Scopes:", session.user.scopes);
      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log("🔄 Redirecting after sign-in...");
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },

  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 3600, // 1 hour
    updateAge: 900, // 15 minutes
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
};
