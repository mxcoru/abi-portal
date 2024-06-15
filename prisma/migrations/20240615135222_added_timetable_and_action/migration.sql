-- CreateEnum
CREATE TYPE "Action" AS ENUM ('USER_SONG_PAGE', 'GROUP_SONG_PAGE', 'GROUP_END_SONG_PAGE', 'NONE');

-- CreateTable
CREATE TABLE "TimetableEntry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "action" "Action" NOT NULL DEFAULT 'NONE',

    CONSTRAINT "TimetableEntry_pkey" PRIMARY KEY ("id")
);
