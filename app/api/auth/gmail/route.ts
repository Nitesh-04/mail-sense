import { NextResponse } from "next/server";
import { getAuthUrl } from "@/utils/gmailAuth";

export async function GET() {
  try {
    const authUrl = await getAuthUrl();
    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json({ error: "Failed to generate auth URL" });
  }
}
