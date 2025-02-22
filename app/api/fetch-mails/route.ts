import { google } from "googleapis";
import { oauth2Client } from "@/utils/gmailAuth";
import prisma from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { categoriseMail } from "@/utils/categoriseMail";
import { summariser } from "@/utils/summariseMail";

async function fetchAndCreateEmails(
  accessToken: string,
  userId: string,
  lastEmailDate: Date | null = null,
  maxResults: number
) {
  oauth2Client.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const queryParams = {
    userId: "me" as "me",
    maxResults: maxResults,
    ...(lastEmailDate ? {
      q: `after:${lastEmailDate.getFullYear()}/${(lastEmailDate.getMonth() + 1).toString().padStart(2, '0')}/${lastEmailDate.getDate().toString().padStart(2, '0')}`
    } : {})
  };

  const response = await gmail.users.messages.list(queryParams);
  const messages = response.data.messages || [];

  const mostRecentEmailDate = new Date(0); 

  await Promise.all(
    messages.map(async (msg) => {
      const msgDetails = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
      });

      const headers = msgDetails.data.payload?.headers || [];
      const subject =
        headers.find((h) => h.name === "Subject")?.value || "No Subject";
      const from =
        headers.find((h) => h.name === "From")?.value || "Unknown Sender";

      const bodyData =
        msgDetails.data.payload?.body?.data ||
        msgDetails.data.payload?.parts?.[0]?.body?.data ||
        "";

      const body = bodyData
        ? Buffer.from(bodyData, "base64").toString("utf-8")
        : "No content";

      const summary = await summariser(body);

      const internalDate =
        msgDetails.data.internalDate || Date.now().toString();
      const receivedAt = new Date(parseInt(internalDate, 10));
      
      if (receivedAt > mostRecentEmailDate) {
        mostRecentEmailDate.setTime(receivedAt.getTime());
      }

      const mailCategory = categoriseMail(from);

      await prisma.email.create({
        data: {
          clerkId: userId,
          sender: from,
          subject,
          summary,
          receivedAt,
          category: mailCategory,
        },
      });
    })
  );

   return mostRecentEmailDate;
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user?.accessToken) {
      return NextResponse.json(
        {
          error: "No access token found. Please authenticate with Gmail first.",
        },
        { status: 401 }
      );
    }

    if (user.tokenExpiry && new Date() > new Date(user.tokenExpiry)) {
      return NextResponse.json(
        { error: "Token expired, please reauthorize with Gmail" },
        { status: 401 }
      );
    }

    const mostRecentEmailDate = !user.firstFetch
      ? await fetchAndCreateEmails(user.accessToken, userId, null, 10)
      : await fetchAndCreateEmails(user.accessToken, userId, user.lastEmailDate, 5);

    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        firstFetch: true,
        lastEmailDate: mostRecentEmailDate,
      },
    });

      return NextResponse.json({
        success: true,
        message: "New emails synced to database",
      });

  } catch (error) {
    console.error("Failed to fetch/create emails:", error);
    return NextResponse.json(
      {
        error: "Failed to process emails",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}