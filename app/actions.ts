"use server";

import { authOptions } from "@/lib/auth";
import { AppFeatures } from "@/lib/config/feature";
import { DatabaseClient } from "@/lib/database";
import { IsFeatureEnabled } from "@/lib/feature";
import { Prisma, Song, SongStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { SendDeleteRequest, SendDownloadRequest } from "@/lib/downloader";
import { decreaseUserCredits } from "@/lib/utils";
import { ManyVideoDownloadRequest } from "@/lib/downloader";

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

  let song = await DatabaseClient.song.findUnique({
    where: { id },
  });

  if (!song) {
    return {
      success: false,
      error: "Song nicht gefunden",
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

  await DatabaseClient.song.delete({ where: { id: id } });

  if (song.status != SongStatus.FINISHED || song.fileId) {
    try {
      console.log(song.fileId);

      await SendDeleteRequest(song.fileId);
    } catch (e) {
      console.log("delete song request");

      //return { success: false, error: "Download fehlgeschlagen", creditsError: false };
    }

    return { success: true, data: null };
  }



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

  if (song.status == SongStatus.FINISHED) {
    await SendDeleteRequest(song.fileId);
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

export async function downloadSong(id: string): Promise<ActionResponse<string>> {
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
    AppFeatures.DownloadSong,
    session.user
  );

  if (!isEnabled) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let song = await DatabaseClient.song.findFirst({
    where: { id: id, status: SongStatus.REQUESTED },
  });

  if (!song) {
    return {
      success: false,
      error: "Dieser Song existiert nicht",
      creditsError: false,
    };
  }

  let response = await SendDownloadRequest([{
    url: song.url,
    start: song.start,
    end: song.end,
  }] satisfies ManyVideoDownloadRequest);


  if (response == null) {
    return {
      success: false,
      error: "Download fehlgeschlagen",
      creditsError: false,
    };
  }

  let fileId = response[0].file_id;

  await DatabaseClient.song.update({
    where: { id: song.id },
    data: { fileId: fileId, status: SongStatus.FINISHED },
  });

  return { success: true, data: "" };
}

export async function downloadAllRequestedSongs(): Promise<ActionResponse<null>> {
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
    AppFeatures.DownloadSong,
    session.user
  );

  if (!isEnabled) {
    return {
      success: false,
      error: "Du hast nicht die nötige Berechtigung",
      creditsError: false,
    };
  }

  let songs = await DatabaseClient.song.findMany({
    where: { status: SongStatus.REQUESTED },
    take: 10
  });

  if (songs.length == 0) {
    return {
      success: false,
      error: "Keine Song vorhanden",
      creditsError: false,
    };
  }

  let response = await SendDownloadRequest(songs.map((song) => ({
    url: song.url,
    start: song.start,
    end: song.end,
  })));

  if (response == null) {
    return {
      success: false,
      error: "Download fehlgeschlagen",
      creditsError: false,
    };
  }

  for (let i = 0; i < response.length; i++) {
    let song = songs[i];

    let fileId = response[i].file_id;

    await DatabaseClient.song.update({
      where: { id: song.id },
      data: { fileId: fileId, status: SongStatus.FINISHED },
    });
  }

  return { success: true, data: null };
}

