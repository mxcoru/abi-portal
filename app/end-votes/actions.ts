"use server";
import { authOptions } from "@/lib/auth";
import { AppFeatures } from "@/lib/config/feature";
import { DatabaseClient } from "@/lib/database";
import { IsFeatureEnabled } from "@/lib/feature";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { SendDeleteRequest, SendDownloadRequest } from "@/lib/downloader";
import { ActionResponse } from "../actions";
import { ManyVideoDownloadRequest } from "@/lib/downloader";


export async function createEndVoteSong(
    data: Omit<Prisma.EndSongVoteRequestCreateInput, "user">
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

    if ((data.end as number) - (data.start as number) > 60 * 10) {
        return {
            success: false,
            error: "Die Zeitraum muss kleiner gleich 2 Minuten sein",
            creditsError: false,
        };
    }

    let createData: Prisma.EndSongVoteRequestCreateInput = {
        title: data.title?.trim(),
        url: data.url?.trim(),
        start: data.start,
        end: data.end,
        user: { connect: { id: session.user.id } },
    };

    await DatabaseClient.endSongVoteRequest.create({ data: createData });

    return { success: true, data: null };
}

export async function voteForEndSong(
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

    let songRequest = await DatabaseClient.endSongVoteRequest.findFirst({
        where: { id: songRequestId },
    });

    if (!songRequest) {
        return {
            success: false,
            error: "Dieser Song ist nicht in deiner Liste",
            creditsError: false,
        };
    }

    let existingVote = await DatabaseClient.endSongVote.findFirst({
        where: { voterId: session.user.id },
        include: { voter: true },
    });

    if (existingVote) {
        await DatabaseClient.endSongVote.update({
            where: { id: existingVote.id },
            data: { songRequest: { connect: { id: songRequestId } } },
        });

        return { success: true, data: null };
    }

    await DatabaseClient.endSongVote.create({
        data: {
            songRequest: { connect: { id: songRequestId } },
            voter: { connect: { id: session.user.id } },
        },
    });

    return { success: true, data: null };
}

export async function deleteEndSongVoteRequest(
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

    let songRequest = await DatabaseClient.endSongVoteRequest.findFirst({
        where: { id: songRequestId },
    });

    if (!songRequest) {
        return {
            success: false,
            error: "Dieser Song ist nicht in deiner Liste",
            creditsError: false,
        };
    }


    if (songRequest.creatorId != session.user.id && !isEnabled) {
        return {
            success: false,
            error: "Du hast nicht die nötige Berechtigung",
            creditsError: false,
        };
    }

    await DatabaseClient.endSongVoteRequest.delete({
        where: { id: songRequestId },
    });

    if (songRequest.finished && songRequest.fileId) {
        console.log("delete song request");

        try {
            await SendDeleteRequest(songRequest.fileId);
        } catch (e) {
            console.log(e);
            return { success: false, error: "Download fehlgeschlagen", creditsError: false };
        }
    }

    return { success: true, data: null };
}

export async function downloadGroupEndSong(id: string): Promise<ActionResponse<string>> {
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

    let song = await DatabaseClient.endSongVoteRequest.findFirst({
        where: { id: id, finished: false },
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

    await DatabaseClient.endSongVoteRequest.update({
        where: { id: song.id },
        data: { fileId: fileId, finished: true },
    });

    return { success: true, data: "" };
}

