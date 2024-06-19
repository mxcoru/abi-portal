"use server";

import { authOptions } from "@/lib/auth";
import { DatabaseClient } from "@/lib/database";
import { Action, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { ActionResponse } from "../actions";
import { IsFeatureEnabled } from "@/lib/feature";
import { AppFeatures } from "@/lib/config/feature";

export async function createTimetableEntry(data: Prisma.TimetableEntryCreateInput): Promise<ActionResponse<null>> {
    let session = await getServerSession(authOptions);

    if (!session) {
        return {
            success: false,
            error: "Du hast nicht die benötigten Berechtigungen um diesen Eintrag zu erstellen.",
            creditsError: false
        };
    }

    let IsTimetableUpdateEnabled = IsFeatureEnabled(AppFeatures.UpdateTimetable, session.user);

    if (!IsTimetableUpdateEnabled) {
        return {
            success: false,
            error: "Du hast nicht die benötigten Berechtigungen um diesen Eintrag zu erstellen.",
            creditsError: false
        };
    }

    await DatabaseClient.timetableEntry.create({
        data
    });

    return {
        success: true,
        data: null
    };
}

export async function updateTimetableEntry(id: string, updateData: { name: string, action: Action }): Promise<ActionResponse<null>> {
    let session = await getServerSession(authOptions);

    if (!session) {
        return {
            success: false,
            error: "Du hast nicht die benötigten Berechtigungen um diesen Eintrag zu erstellen.",
            creditsError: false
        };
    }

    let IsTimetableUpdateEnabled = IsFeatureEnabled(AppFeatures.UpdateTimetable, session.user);

    if (!IsTimetableUpdateEnabled) {
        return {
            success: false,
            error: "Du hast nicht die benötigten Berechtigungen um diesen Eintrag zu erstellen.",
            creditsError: false
        };
    }

    let entry = await DatabaseClient.timetableEntry.findUnique({
        where: {
            id: id
        }
    });

    if (!entry) {
        return {
            success: false,
            error: "Der Eintrag wurde nicht gefunden.",
            creditsError: false
        };
    }

    await DatabaseClient.timetableEntry.update({
        where: {
            id: entry.id
        },
        data: {
            name: updateData.name,
            action: updateData.action
        }
    });

    return {
        success: true,
        data: null
    };
}

export async function updateTimetableEntryOrder(id: string, order: number): Promise<ActionResponse<null>> {
    let session = await getServerSession(authOptions);

    if (!session) {
        return {
            success: false,
            error: "Du hast nicht die benötigten Berechtigungen um diesen Eintrag zu erstellen.",
            creditsError: false
        };
    }

    let IsTimetableUpdateEnabled = IsFeatureEnabled(AppFeatures.UpdateTimetable, session.user);

    if (!IsTimetableUpdateEnabled) {
        return {
            success: false,
            error: "Du hast nicht die benötigten Berechtigungen um diesen Eintrag zu erstellen.",
            creditsError: false
        };
    }

    let entry = await DatabaseClient.timetableEntry.findUnique({
        where: {
            id: id
        }
    });

    if (!entry) {
        return {
            success: false,
            error: "Der Eintrag wurde nicht gefunden.",
            creditsError: false
        };
    }

    await DatabaseClient.timetableEntry.update({
        where: {
            id: entry.id
        },
        data: {
            order: order
        }
    });

    return {
        success: true,
        data: null
    };
}

export async function deleteTimetableEntry(id: string): Promise<ActionResponse<null>> {
    let session = await getServerSession(authOptions);

    if (!session) {
        return {
            success: false,
            error: "Du hast nicht die benötigten Berechtigungen um diesen Eintrag zu erstellen.",
            creditsError: false
        };
    }

    let IsTimetableUpdateEnabled = IsFeatureEnabled(AppFeatures.UpdateTimetable, session.user);

    if (!IsTimetableUpdateEnabled) {
        return {
            success: false,
            error: "Du hast nicht die benötigten Berechtigungen um diesen Eintrag zu erstellen.",
            creditsError: false
        };
    }

    await DatabaseClient.timetableEntry.delete({
        where: {
            id: id
        }
    });

    return {
        success: true,
        data: null
    };
}