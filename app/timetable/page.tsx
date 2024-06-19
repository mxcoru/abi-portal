import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { DatabaseClient } from "@/lib/database";
import { IsFeatureEnabled } from "@/lib/feature";
import { AppFeatures } from "@/lib/config/feature";
import { TimetableEntry } from "@prisma/client";
import { Base } from "@/components/Base";
import { Timetable } from "@/components/timetable/Timetable";
import { TimetableEntryCreateDialog } from "@/components/timetable/TimetableCreateDialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function Home() {
    const session = await getServerSession(authOptions);

    let timetableEntries: TimetableEntry[] = [];
    let IsTimetableEntryUpdateEnabled = false;

    if (session?.user) {
        timetableEntries = await DatabaseClient.timetableEntry.findMany({
            orderBy: {
                order: "desc"
            },
        });

        IsTimetableEntryUpdateEnabled = await IsFeatureEnabled(
            AppFeatures.UpdateTimetable,
            session.user
        );

    }

    return (
        <Base>
            <Card className="">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold flex flex-row place-content-between w-full">
                        <p></p>
                        <p>Der Abitur Zeitplan fürs PZ</p>
                        <TimetableEntryCreateDialog disabled={!IsTimetableEntryUpdateEnabled} />
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center xl:max-h-[700px] max-h-[320px] min-w-[500px]">
                    {session ? (
                        <Timetable
                            timetableEntries={timetableEntries}
                        />
                    ) : (
                        <p className="text-red-500">Bitte einloggen</p>
                    )}
                </CardContent>
            </Card>
        </Base>
    );
}
