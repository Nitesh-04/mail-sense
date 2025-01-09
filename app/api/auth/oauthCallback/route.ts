import { NextResponse } from "next/server";
import { getTokens, oauth2Client } from "@/utils/gmailAuth";
import prisma from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { google } from "googleapis";

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No authorization code found" });
  }

  try {
    const tokens = await getTokens(code);

    if (!tokens || !tokens.access_token || !tokens.refresh_token) {
      console.error("Failed to retrieve tokens:", tokens);
      return NextResponse.json({ error: "Failed to retrieve tokens" });
    }

    const expiryDate = new Date(Date.now() + (tokens.expires_in) * 1000);;
    console.log("Expiry Date:", expiryDate);
    
    oauth2Client.setCredentials(tokens);

    
    const oauth2 = google.oauth2('v2');
    const userinfo = await oauth2.userinfo.get({
      auth: oauth2Client
    });

    if (!userinfo.data || !userinfo.data.email) {
      return NextResponse.json({ error: "Failed to fetch email" });
    }

    
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: expiryDate,
      },
    });

    return NextResponse.redirect(new URL("/mail", req.url));
  } catch (error) {
    console.error("OAuth Error:", error);
    return NextResponse.json({ 
      error: "OAuth failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}