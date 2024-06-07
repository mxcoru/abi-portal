"use server";

import { DatabaseClient } from "@/lib/database";
import { Prisma, Song, SongStatus, User } from "@prisma/client";

export type ActionResponse<T> =
  | { success: false; error: string; creditsError: boolean }
  | { success: true; data: T };

export async function deleteSong(
  userId: string,
  id: string
): Promise<ActionResponse<null>> {
  "use server";

  let IsUserAble = await decreaseUserCredits(userId);

  if (!IsUserAble) {
    return {
      success: false,
      error: "Du hast nicht genug Credits",
      creditsError: true,
    };
  }

  await DatabaseClient.song.delete({ where: { id: id } });

  return { success: true, data: null };
}

export async function updateSong(
  userId: string,
  id: string,
  data: Partial<Song>
): Promise<ActionResponse<Song>> {
  "use server";

  let IsUserAble = await decreaseUserCredits(userId);

  if (!IsUserAble) {
    return {
      success: false,
      error: "Du hast nicht genug Credits",
      creditsError: true,
    };
  }

  data.status = SongStatus.REQUESTED;

  let song = await DatabaseClient.song.update({
    where: { id: id },
    data: data,
  });

  return { success: true, data: song };
}

export async function updateSongOrder(
  id: string,
  order: number
): Promise<ActionResponse<number>> {
  "use server";

  await DatabaseClient.song.update({
    where: { id: id },
    data: { order: order },
  });

  return { success: true, data: order };
}

export async function createSong(
  userId: string,
  data: Omit<Prisma.SongCreateInput, "user">
): Promise<ActionResponse<Song>> {
  "use server";

  let IsUserAble = await decreaseUserCredits(userId);

  if (!IsUserAble) {
    return {
      success: false,
      error: "Du hast nicht genug Credits",
      creditsError: true,
    };
  }

  let createData: Prisma.SongCreateInput = {
    ...data,
    user: { connect: { id: userId } },
  };

  let song = await DatabaseClient.song.create({ data: createData });

  return { success: true, data: song };
}

export async function decreaseUserCredits(id: string): Promise<boolean> {
  "use server";

  let user = await DatabaseClient.user.findUnique({
    where: { id: id },
    include: { songs: true },
  });

  if (!user) {
    return false;
  }

  if (user.credits === 0) {
    return false;
  }

  await DatabaseClient.user.update({
    where: { id: id },
    data: { credits: user.credits - 1 },
  });

  return true;
}

export async function getUserCredits(id: string): Promise<number> {
  "use server";

  let user = await DatabaseClient.user.findUnique({
    where: { id: id },
    include: { songs: true },
  });

  if (!user) {
    return 0;
  }

  return user.credits;
}

export async function createVoteSong(
  userid: string,
  data: Omit<Prisma.SongVoteRequestCreateInput, "user">
): Promise<ActionResponse<null>> {
  "use server";

  let createData: Prisma.SongVoteRequestCreateInput = {
    ...data,
    user: { connect: { id: userid } },
  };

  await DatabaseClient.songVoteRequest.create({ data: createData });

  return { success: true, data: null };
}

export async function voteForSong(
  userId: string,
  songRequestId: string
): Promise<ActionResponse<null>> {
  "use server";

  let songRequest = await DatabaseClient.songVoteRequest.findFirst({
    where: { id: songRequestId },
  });

  if (!songRequest) {
    return {
      success: false,
      error: "Dieser Song ist nicht in deiner Liste",
      creditsError: true,
    };
  }

  let existingVote = await DatabaseClient.songVote.findFirst({
    where: { voterId: userId },
    include: { voter: true },
  });

  if (existingVote) {
    await DatabaseClient.songVote.update({
      where: { id: existingVote.id },
      data: { songRequest: { connect: { id: songRequestId } } },
    });

    return { success: true, data: null };
  }

  await DatabaseClient.songVote.create({
    data: {
      songRequest: { connect: { id: songRequestId } },
      voter: { connect: { id: userId } },
    },
  });

  return { success: true, data: null };
}

export async function deleteSongVoteRequest(
  songRequestId: string
): Promise<ActionResponse<null>> {
  "use server";

  let songRequest = await DatabaseClient.songVoteRequest.findUnique({
    where: { id: songRequestId },
  });

  if (!songRequest) {
    return {
      success: false,
      error: "Dieser Song ist nicht in deiner Liste",
      creditsError: true,
    };
  }
  return { success: true, data: null };
}

export async function addCredits(
  userId: string,
  amount: number
): Promise<ActionResponse<null>> {
  "use server";

  let user = await DatabaseClient.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return {
      success: false,
      error: "Dieser Benutzer existiert nicht",
      creditsError: true,
    };
  }

  await DatabaseClient.user.update({
    where: { id: user.id },
    data: { credits: user.credits + amount },
  });

  return { success: true, data: null };
}

export async function declineSong(
  songId: string
): Promise<ActionResponse<null>> {
  "use server";

  let song = await DatabaseClient.song.findUnique({
    where: { id: songId },
  });

  if (!song) {
    return {
      success: false,
      error: "Dieser Song existiert nicht",
      creditsError: true,
    };
  }

  await DatabaseClient.song.update({
    where: { id: song.id },
    data: { status: SongStatus.DECLINED },
  });

  return { success: true, data: null };
}
