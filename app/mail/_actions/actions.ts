"use server"

import prisma from "@/utils/db";

export async function getAcademicMails(userId : String)
{
    return await prisma.email.findMany({
        where: {
            clerkId: userId,
            category: "Academics"
        },
        orderBy : {updatedAt: 'desc'},
        take: 5
    });
}

export async function getCdcMails(userId : String)
{
    return await prisma.email.findMany({
        where: {
            clerkId: userId,
            category: "Cdc"
        },
        orderBy : {updatedAt: 'desc'},
        take: 5
    });
}

export async function getEventsMails(userId : String)
{
    return await prisma.email.findMany({
        where: {
            clerkId: userId,
            category: "Events"
        },
        orderBy : {updatedAt: 'desc'},
        take: 5
    });
}

export async function getHostelMails(userId : String)
{
    return await prisma.email.findMany({
        where: {
            clerkId: userId,
            category: "Hostel"
        },
        orderBy : {updatedAt: 'desc'},
        take: 5
    });
}

export async function getMiscMails(userId : String)
{
    return await prisma.email.findMany({
        where: {
            clerkId: userId,
            category: "Misc"
        },
        orderBy : {updatedAt: 'desc'},
        take: 5
    });
}