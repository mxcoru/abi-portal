"use server";

import { authOptions } from "@/lib/auth";
import { AppFeatures } from "@/lib/config/feature";
import { DatabaseClient } from "@/lib/database";
import { IsFeatureEnabled } from "@/lib/feature";
import { Prisma, Song, SongStatus, UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";

export type ActionResponse<T> =
  | { success: false; error: string; creditsError: boolean }
  | { success: true; data: T };

export async function deleteSong(id: string): Promise<ActionResponse<null>> {
  "use server";

  let session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }
  let IsUserAble = await decreaseUserCredits(session.user.id);

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
  id: string,
  data: Partial<Song>
): Promise<ActionResponse<Song>> {
  "use server";

  let session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let song = await DatabaseClient.song.findFirst({
    where: { id: id },
  });

  if (!song) {
    return {
      success: false,
      error: "Dieser Song existiert nicht",
      creditsError: false,
    };
  }

  if (song.userId != session.user.id) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  if (
    song.title == data.title?.trim() &&
    song.url == data.url?.trim() &&
    song.start == data.start &&
    song.end == data.end
  ) {
    return {
      success: false,
      error: "Du hast keine Änderungen vorgenommen",
      creditsError: false,
    };
  }

  if (data.start == 0 && data.end == 0) {
    return {
      success: false,
      error: "Du hast keinen Zeitraum angegeben",
      creditsError: false,
    };
  }

  if ((data.end as number) - (data.start as number) > 60 * 2) {
    return {
      success: false,
      error: "Die Zeitraum muss kleiner gleich 2 Minuten sein",
      creditsError: false,
    };
  }

  if ((data.start as number) > (data.end as number)) {
    return {
      success: false,
      error: "Die Startzeit muss kleiner als die Endzeit sein",
      creditsError: false,
    };
  }

  let IsUserAble = await decreaseUserCredits(session.user.id);

  if (!IsUserAble) {
    return {
      success: false,
      error: "Du hast nicht genug Credits",
      creditsError: true,
    };
  }

  data.status = SongStatus.REQUESTED;

  let newSong = await DatabaseClient.song.update({
    where: { id: id },
    data: {
      title: data.title?.trim(),
      url: data.url?.trim(),
      start: data.start,
      end: data.end,
      status: SongStatus.REQUESTED,
    },
  });

  return { success: true, data: newSong };
}

export async function updateSongOrder(
  id: string,
  order: number
): Promise<ActionResponse<number>> {
  "use server";

  let session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let song = await DatabaseClient.song.update({
    where: { id: id, userId: session.user.id },
    data: { order: order },
  });

  if (!song) {
    return {
      success: false,
      error: "Dieser Song existiert nicht",
      creditsError: false,
    };
  }

  return { success: true, data: order };
}

export async function createSong(
  data: Omit<Prisma.SongCreateInput, "user">
): Promise<ActionResponse<Song>> {
  "use server";

  let session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let isEnabled = await IsFeatureEnabled(
    AppFeatures.SongCreation,
    session.user
  );

  if (!isEnabled) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  if (data.start == 0 && data.end == 0) {
    return {
      success: false,
      error: "Du hast keinen Zeitraum angegeben",
      creditsError: false,
    };
  }

  if ((data.start as number) > (data.end as number)) {
    return {
      success: false,
      error: "Die Startzeit muss kleiner als die Endzeit sein",
      creditsError: false,
    };
  }

  if ((data.end as number) - (data.start as number) > 60 * 2) {
    return {
      success: false,
      error: "Die Zeitraum muss kleiner gleich 2 Minuten sein",
      creditsError: false,
    };
  }

  let IsUserAble = await decreaseUserCredits(session.user.id);

  if (!IsUserAble) {
    return {
      success: false,
      error: "Du hast nicht genug Credits",
      creditsError: true,
    };
  }

  let createData: Prisma.SongCreateInput = {
    title: data.title?.trim(),
    url: data.url?.trim(),
    start: data.start,
    end: data.end,
    user: { connect: { id: session.user.id } },
  };

  let song = await DatabaseClient.song.create({ data: createData });

  return { success: true, data: song };
}

async function decreaseUserCredits(id: string): Promise<boolean> {
  "use server";

  let user = await DatabaseClient.user.findFirst({
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

export async function getUserCredits(): Promise<number> {
  let session = await getServerSession(authOptions);

  if (!session?.user) {
    return 0;
  }

  let user = await DatabaseClient.user.findFirst({
    where: { id: session.user.id },
    include: { songs: true },
  });

  if (!user) {
    return 0;
  }

  return user.credits;
}

export async function createVoteSong(
  data: Omit<Prisma.SongVoteRequestCreateInput, "user">
): Promise<ActionResponse<null>> {
  "use server";

  let session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let isEnabled = await IsFeatureEnabled(
    AppFeatures.VoteSongRequestCreation,
    session.user
  );

  if (!isEnabled) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  if (data.start == 0 && data.end == 0) {
    return {
      success: false,
      error: "Du hast keinen Zeitraum angegeben",
      creditsError: false,
    };
  }

  if ((data.start as number) > (data.end as number)) {
    return {
      success: false,
      error: "Die Startzeit muss kleiner als die Endzeit sein",
      creditsError: false,
    };
  }

  if ((data.end as number) - (data.start as number) > 60 * 2) {
    return {
      success: false,
      error: "Die Zeitraum muss kleiner gleich 2 Minuten sein",
      creditsError: false,
    };
  }

  let createData: Prisma.SongVoteRequestCreateInput = {
    title: data.title?.trim(),
    url: data.url?.trim(),
    start: data.start,
    end: data.end,
    user: { connect: { id: session.user.id } },
  };

  await DatabaseClient.songVoteRequest.create({ data: createData });

  return { success: true, data: null };
}

export async function voteForSong(
  songRequestId: string
): Promise<ActionResponse<null>> {
  "use server";

  let session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let isEnabled = await IsFeatureEnabled(AppFeatures.Voting, session.user);

  if (!isEnabled) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let songRequest = await DatabaseClient.songVoteRequest.findFirst({
    where: { id: songRequestId },
  });

  if (!songRequest) {
    return {
      success: false,
      error: "Dieser Song ist nicht in deiner Liste",
      creditsError: false,
    };
  }

  let existingVote = await DatabaseClient.songVote.findFirst({
    where: { voterId: session.user.id },
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
      voter: { connect: { id: session.user.id } },
    },
  });

  return { success: true, data: null };
}

export async function deleteSongVoteRequest(
  songRequestId: string
): Promise<ActionResponse<null>> {
  "use server";

  let session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let isEnabled = await IsFeatureEnabled(
    AppFeatures.GroupSongRequestAdmin,
    session.user
  );

  let songRequest = await DatabaseClient.songVoteRequest.delete({
    where: {
      id: songRequestId,
      creatorId: isEnabled ? undefined : session.user.id,
    },
  });

  if (!songRequest) {
    return {
      success: false,
      error: "Dieser Song ist nicht in deiner Liste",
      creditsError: false,
    };
  }

  return { success: true, data: null };
}

export async function addCredits(
  userId: string,
  amount: number
): Promise<ActionResponse<null>> {
  "use server";

  let session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let isEnabled = await IsFeatureEnabled(
    AppFeatures.AddUserCredits,
    session.user
  );

  if (!isEnabled) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let user = await DatabaseClient.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    return {
      success: false,
      error: "Dieser Benutzer existiert nicht",
      creditsError: false,
    };
  }

  await DatabaseClient.user.update({
    where: { id: user.id },
    data: { credits: user.credits + amount },
  });

  return { success: true, data: null };
}

export async function setCredits(
  name: string,
  amount: number
): Promise<ActionResponse<null>> {
  "use server";

  let session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let isEnabled = await IsFeatureEnabled(
    AppFeatures.SetUserCredits,
    session.user
  );

  if (!isEnabled) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  console.log(name);

  let user = await DatabaseClient.user.findFirst({
    where: {
      name: {
        mode: "insensitive",
        equals: name,
      },
    },
  });

  if (!user) {
    return {
      success: false,
      error: "Dieser Benutzer existiert nicht",
      creditsError: false,
    };
  }

  await DatabaseClient.user.update({
    where: { id: user.id },
    data: { credits: amount },
  });

  return { success: true, data: null };
}

export async function declineSong(
  songId: string
): Promise<ActionResponse<null>> {
  "use server";

  let session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  if (
    session.user.role != UserRole.ADMIN &&
    session.user.role != UserRole.SUPER_ADMIN
  ) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let song = await DatabaseClient.song.findFirst({
    where: { id: songId },
  });

  if (!song) {
    return {
      success: false,
      error: "Dieser Song existiert nicht",
      creditsError: false,
    };
  }

  await DatabaseClient.song.update({
    where: { id: song.id },
    data: { status: SongStatus.DECLINED },
  });

  return { success: true, data: null };
}

export async function deleteAllCredits(): Promise<ActionResponse<null>> {
  "use server";

  let session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let isEnabled = await IsFeatureEnabled(
    AppFeatures.DeleteAllUserCredits,
    session.user
  );

  if (!isEnabled) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  await DatabaseClient.user.updateMany({
    data: { credits: 0 },
  });

  return { success: true, data: null };
}
