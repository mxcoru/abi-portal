-- CreateTable
CREATE TABLE "EndSongVoteRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "start" INTEGER NOT NULL DEFAULT 0,
    "end" INTEGER NOT NULL DEFAULT 0,
    "fileId" TEXT NOT NULL DEFAULT '',
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "EndSongVoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndSongVote" (
    "id" TEXT NOT NULL,
    "songRequestId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,

    CONSTRAINT "EndSongVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EndSongVote_voterId_key" ON "EndSongVote"("voterId");

-- AddForeignKey
ALTER TABLE "EndSongVoteRequest" ADD CONSTRAINT "EndSongVoteRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EndSongVote" ADD CONSTRAINT "EndSongVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EndSongVote" ADD CONSTRAINT "EndSongVote_songRequestId_fkey" FOREIGN KEY ("songRequestId") REFERENCES "EndSongVoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
