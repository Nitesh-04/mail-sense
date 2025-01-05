import { google } from "googleapis";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function getAuthUrl() {

    const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userMailId = user.primaryEmailAddress?.emailAddress;

  const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  console.log("Generating Google OAuth URL...");

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    login_hint: userMailId,
    prompt: "consent",
  });

  console.log("Generated URL:", url);

  return url;
}

export async function getTokens(code: string) {
  console.log("Exchanging authorization code for tokens...");
  try {
    const { tokens, res } = await oauth2Client.getToken(code);
    const expiresIn = res?.data?.expires_in || 3600;
    console.log("Tokens received:", tokens);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
      expires_in: expiresIn,
    };
  } catch (error) {
    console.error("Error getting tokens:", error);
    throw error;
  }
}

export function setCredentials(accessToken: string, refreshToken: string) {
  console.log("Setting OAuth credentials...");
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return oauth2Client;
}
