"use server";

import { authOptions } from "@/lib/auth";
import { DatabaseClient } from "@/lib/database";
import { getServerSession } from "next-auth";
import { ActionResponse } from "../actions";
import { TimetableEntry } from "@prisma/client";
import { IsFeatureEnabled } from "@/lib/feature";
import { AppFeatures } from "@/lib/config/feature";

export async function fetchTimetableEntries(): Promise<ActionResponse<TimetableEntry[]>> {
    "use server";

    let session = await getServerSession(authOptions);

    if (!session?.user) {
        return {
            success: false,
            error: "Du hast nicht die benötigten Berechtigungen",
            creditsError: false,
        }
    }

    let IsLiveViewEnabled = await IsFeatureEnabled(
        AppFeatures.Liveview,
        session.user
    );

    if (!IsLiveViewEnabled) {
        return {
            success: false,
            error: "Du hast nicht die benötigten Berechtigungen",
            creditsError: false,
        }
    }

    const timetableEntries = await DatabaseClient.timetableEntry.findMany({
        orderBy: {
            order: "desc"
        },
    });

    return {
        success: true,
        data: timetableEntries,
    }
}