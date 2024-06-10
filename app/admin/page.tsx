import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationBar } from "@/components/NavigationBar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { DatabaseClient } from "@/lib/database";
import { SongStatus, UserRole } from "@prisma/client";
import { NoSongTable } from "@/components/admin/NoSongTable";
import { BrokeeTable } from "@/components/admin/BrokeeTable";
import { RequestedSongTable } from "@/components/admin/RequestedSongTable";
import { Base } from "@/components/Base";
import { AppFeatures } from "@/lib/config/feature";
import { IsFeatureEnabled } from "@/lib/feature";

export default async function Home() {
  let session = await getServerSession(authOptions);

  if (
    !session?.user ||
    (session.user.role != UserRole.ADMIN &&
      session.user.role != UserRole.SUPER_ADMIN)
  ) {
    return (
      <div className="w-full h-svh flex flex-row">
        <NavigationBar />
        <div className="w-5/6 h-svh flex flex-col justify-center items-center">
          <p className="text-red-500">Du hast keinen Admin Zugriff</p>
        </div>
      </div>
    );
  }

  let users = await DatabaseClient.user.findMany({
    where: {
      songs: {
        every: {
          NOT: {
            status: SongStatus.FINISHED,
          },
        },
      },
    },

    include: { songs: true },
  });

  let brokee = await DatabaseClient.user.findMany({
    where: {
      credits: 0,
    },
  });

  let request_songs = await DatabaseClient.song.findMany({
    where: {
      status: SongStatus.REQUESTED,
    },
    include: { user: true },
  });

  let CanAddCredits = await IsFeatureEnabled(
    AppFeatures.AddUserCredits,
    session.user
  );

  return (
    <Base adminLayout>
      <Card className="row-start-1 col-start-1 lg:col-span-2 row-span-2 col-span-6">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">
            Benutzer ohne fertige Songs
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center max-h-[370px] overflow-y-auto">
          <NoSongTable users={users} />
        </CardContent>
      </Card>
      <Card className="row-start-3 lg:row-start-1 col-start-1 lg:col-start-5 lg:col-span-2 row-span-2 col-span-6">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">
            Benutzer ohne Credits
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center max-h-[370px] overflow-y-auto ">
          <BrokeeTable users={brokee} canAddCredits={CanAddCredits} />
        </CardContent>
      </Card>
      <Card className="row-start-5 lg:row-start-3 col-start-1 xl:col-start-2 xl:col-span-4 md:col-span-6 row-span-2 col-span-6">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">
            Songs In Bearbeitung
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center max-h-[370px] overflow-y-auto">
          <RequestedSongTable songs={request_songs} />
        </CardContent>
      </Card>
    </Base>
  );
}
