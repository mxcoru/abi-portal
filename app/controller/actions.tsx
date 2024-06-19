"use server";

import { authOptions } from "@/lib/auth";
import { AppFeatures } from "@/lib/config/feature";
import { IsFeatureEnabled } from "@/lib/feature";
import { getServerSession } from "next-auth";
import { ActionResponse } from "../actions";
import { SongStatus } from "@prisma/client";
import { DatabaseClient } from "@/lib/database";
import { User } from "@/components/liveview/controller/UserSong";

export async function getUsers(): Promise<ActionResponse<User[]>> {
    "use server";
    let session = await getServerSession(authOptions);

    if (!session?.user) {
        return {
            success: false,
            error: "Du hast nicht die nötige Berechtigung",
            creditsError: false,
        };
    }

    let IsLiveviewControllerEnabled = await IsFeatureEnabled(
        AppFeatures.LiveviewController,
        session.user
    );

    if (!IsLiveviewControllerEnabled) {
        return {
            success: false,
            error: "Du hast nicht die nötige Berechtigung",
            creditsError: false,
        };
    }

    let users = await DatabaseClient.user.findMany({
        where: {
            name: {
                not: undefined
            },
            songs: {
                some: {
                    status: SongStatus.FINISHED,
                },
            },
        },

        include: {
            songs: {
                orderBy: {
                    order: "desc",
                }
            }
        },
        orderBy: {
            name: "asc"
        }
    });

    if (!users) {
        return {
            success: false,
            error: "Keine Song vorhanden",
            creditsError: false,
        };
    }

    return {
        success: true, data: users.map((user) => ({
            id: user.id,
            name: user.name as string,
            songs: user.songs.map((song) => ({
                title: song.title,
                fileId: song.fileId,
                start: song.start,
                end: song.end,
            })),
        }))
    };
}
