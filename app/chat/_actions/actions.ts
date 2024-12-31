"use server"

import prisma from "@/utils/db";

export async function checkUser(
  clerkId: string,
  email: string,
  name: string,
) {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId }, { mailId: email }],
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: "User already exists with this clerkId or email",
        data: null,
      };
    }

    const newUser = await prisma.user.create({
      data: {
        clerkId,
        name,
        mailId : email,
      },
    });

    return {
      success: true,
      data: newUser,
      error: null,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      error: "Failed to register user",
      data: null,
    };
  }
}
