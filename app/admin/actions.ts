"use server";
import { authOptions } from "@/lib/auth";
import { AppFeatures } from "@/lib/config/feature";
import { DatabaseClient } from "@/lib/database";
import { IsFeatureEnabled } from "@/lib/feature";
import { SongStatus, UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { ActionResponse } from "../actions";


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

    if (session.user.role != UserRole.ADMIN &&
        session.user.role != UserRole.SUPER_ADMIN) {
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
