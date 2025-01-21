-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Academics', 'Cdc', 'Events', 'Hostel', 'Misc');

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "clerkId" STRING NOT NULL,
    "name" STRING NOT NULL,
    "mailId" STRING NOT NULL,
    "accessToken" STRING,
    "refreshToken" STRING,
    "tokenExpiry" TIMESTAMP(3),
    "lastEmailDate" TIMESTAMP(3),
    "firstFetch" BOOL NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" STRING NOT NULL,
    "clerkId" STRING NOT NULL,
    "sender" STRING NOT NULL,
    "subject" STRING NOT NULL,
    "body" STRING,
    "summary" STRING NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "category" "Category" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_mailId_key" ON "User"("mailId");

-- CreateIndex
CREATE INDEX "Email_clerkId_idx" ON "Email"("clerkId");

-- CreateIndex
CREATE INDEX "Email_receivedAt_idx" ON "Email"("receivedAt");

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
