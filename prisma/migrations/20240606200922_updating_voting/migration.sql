-- DropForeignKey
ALTER TABLE "SongVote" DROP CONSTRAINT "SongVote_songRequestId_fkey";

-- AddForeignKey
ALTER TABLE "SongVote" ADD CONSTRAINT "SongVote_songRequestId_fkey" FOREIGN KEY ("songRequestId") REFERENCES "SongVoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
