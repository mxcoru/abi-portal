import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavigationBar } from "@/components/NavigationBar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { DatabaseClient } from "@/lib/database";
import { UserSongTable } from "@/components/songs/UserSongTable";
import { AuthButton } from "@/components/auth";

export default async function Home() {
  let session = await getServerSession(authOptions);

  let songs = await DatabaseClient.song.findMany({
    where: { userId: session?.user?.id ?? "" },
    orderBy: { order: "desc" },
  });

  return (
    <div className="w-full h-svh flex flex-row">
      <NavigationBar />
      <div className="w-5/6 h-svh flex flex-col justify-center items-center">
        <Card className="">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold">
              Deine Song Anfragen
            </CardTitle>
            <CardDescription className="w-fit">
              Zur Bearbeitung und Löschung braucht du ein Credit. Wenn du deine
              Credits schon verbraucht hast, kannst du sie bei der Finanzgruppe
              kaufen.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center">
            {session ? <UserSongTable songs={songs} /> : <AuthButton />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
