-- AlterTable
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 5;

-- CreateTable
CREATE TABLE "SongVoteRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "start" INTEGER NOT NULL DEFAULT 0,
    "end" INTEGER NOT NULL DEFAULT 0,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "SongVoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongVote" (
    "id" TEXT NOT NULL,
    "songRequestId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,

    CONSTRAINT "SongVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SongVote_voterId_key" ON "SongVote"("voterId");

-- AddForeignKey
ALTER TABLE "SongVoteRequest" ADD CONSTRAINT "SongVoteRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongVote" ADD CONSTRAINT "SongVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongVote" ADD CONSTRAINT "SongVote_songRequestId_fkey" FOREIGN KEY ("songRequestId") REFERENCES "SongVoteRequest"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
