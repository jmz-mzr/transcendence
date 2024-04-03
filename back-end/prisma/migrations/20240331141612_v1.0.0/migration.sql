-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "private",
ADD COLUMN     "bannedUserIds" INTEGER[],
ADD COLUMN     "isDM" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isProtected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastMessageId" INTEGER;

-- AlterTable
ALTER TABLE "ChannelUser" DROP COLUMN "admin",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastReadMessageId" INTEGER,
ADD COLUMN     "mutedUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "playerOne",
DROP COLUMN "playerTwo",
ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "launchedAt" TIMESTAMP(3),
ADD COLUMN     "playerOneId" INTEGER NOT NULL,
ADD COLUMN     "playerTwoId" INTEGER NOT NULL,
ALTER COLUMN "playerOneScore" SET DEFAULT 0,
ALTER COLUMN "playerTwoScore" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "blockedUsers",
DROP COLUMN "friends",
ADD COLUMN     "achievements" TEXT[],
ADD COLUMN     "draws" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "elo" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "losses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "twoFactorSecret" TEXT,
ADD COLUMN     "wins" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "ChannelSanction";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "_BlockedList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_FriendsList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_GameToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlockedList_AB_unique" ON "_BlockedList"("A" ASC, "B" ASC);

-- CreateIndex
CREATE INDEX "_BlockedList_B_index" ON "_BlockedList"("B" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "_FriendsList_AB_unique" ON "_FriendsList"("A" ASC, "B" ASC);

-- CreateIndex
CREATE INDEX "_FriendsList_B_index" ON "_FriendsList"("B" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "_GameToUser_AB_unique" ON "_GameToUser"("A" ASC, "B" ASC);

-- CreateIndex
CREATE INDEX "_GameToUser_B_index" ON "_GameToUser"("B" ASC);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedList" ADD CONSTRAINT "_BlockedList_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedList" ADD CONSTRAINT "_BlockedList_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FriendsList" ADD CONSTRAINT "_FriendsList_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FriendsList" ADD CONSTRAINT "_FriendsList_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToUser" ADD CONSTRAINT "_GameToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToUser" ADD CONSTRAINT "_GameToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

