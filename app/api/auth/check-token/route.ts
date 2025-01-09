
import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { OAuth2Client } from 'google-auth-library';
import { auth } from "@clerk/nextjs/server";

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        hasToken: false, 
        error: "No user authenticated" 
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { 
        refreshToken: true,
        accessToken: true,
        tokenExpiry: true 
      }
    });

    if (!user?.refreshToken || !user?.accessToken) {
      return NextResponse.json({ 
        hasToken: false,
        error: "No Gmail authentication found"
      });
    }

    const tokenExpiryTime = user.tokenExpiry ? new Date(user.tokenExpiry) : null;
    const isTokenExpired = !tokenExpiryTime || tokenExpiryTime.getTime() - Date.now() < 300000;

    if (isTokenExpired) {
      try {
        oauth2Client.setCredentials({
          refresh_token: user.refreshToken,
          access_token: user.accessToken
        });

        const { credentials } = await oauth2Client.refreshAccessToken();
        
        if (!credentials.access_token) {
          throw new Error("Failed to obtain new access token");
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            accessToken: credentials.access_token,
            refreshToken: credentials.refresh_token || user.refreshToken,
            tokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null
          }
        });

        return NextResponse.json({ 
          hasToken: true, 
          tokenRefreshed: true 
        });
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return NextResponse.json({ 
          hasToken: false, 
          error: "Failed to refresh Gmail authentication" 
        });
      }
    }

    return NextResponse.json({ hasToken: true });

  } catch (error) {
    console.error("Token check error:", error);
    return NextResponse.json({ 
      hasToken: false, 
      error: "Authentication validation failed" 
    }, { status: 500 });
  }
}