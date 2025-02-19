import "next-auth";
import type { JWT } from "next-auth/jwt";

/** ✅ Microsoft Graph API User Type */
interface MicrosoftGraphUser {
  "@odata.context"?: string;
  businessPhones?: string[];
  displayName?: string | null;
  givenName?: string | null;
  jobTitle?: string | null;
  mail?: string | null;
  mobilePhone?: string | null;
  officeLocation?: string | null;
  preferredLanguage?: string | null;
  surname?: string | null;
  userPrincipalName?: string;
  id: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      provider?: string; // Store provider ("entraID", "native", etc.)
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: number;
      scopes?: string[]; // Store OAuth Scopes
      oid?: string | null; // Add oid to session
    } & Partial<MicrosoftGraphUser>;
    expires: string;
  }

  interface User extends Partial<MicrosoftGraphUser> {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    userPrincipalName?: string;
    provider?: string; // Store provider in user object
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    scopes?: string[]; // Store OAuth Scopes
    oid?: string | null; // Add oid to user
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Partial<MicrosoftGraphUser> {
    id: string;
    sub: string;
    email: string | null;
    picture: string | null;
    userPrincipalName?: string;
    userDetails?: MicrosoftGraphUser;
    provider?: string; // Store provider in JWT
    iat: number;
    exp: number;
    jti: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    scopes?: string[]; // Store OAuth Scopes in JWT
    oid?: string | null; // Add oid to JWT
  }
}
