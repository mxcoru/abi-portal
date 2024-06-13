-- AlterTable
ALTER TABLE "SongVoteRequest" ADD COLUMN     "fileId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "finished" BOOLEAN NOT NULL DEFAULT false;
