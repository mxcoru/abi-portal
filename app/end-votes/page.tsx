import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { DatabaseClient } from "@/lib/database";
import { IsFeatureEnabled } from "@/lib/feature";
import { AppFeatures } from "@/lib/config/feature";
import { EndSongVote, EndSongVoteRequest } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Base } from "@/components/Base";
import { EndVotingTable } from "@/components/end-voting/VotingTable";
import { EndVoteSongCreateDialog } from "@/components/end-voting/CreateVoteDialog";

export default async function Home() {
  const session = await getServerSession(authOptions);

  let votes: (EndSongVoteRequest & { votes: EndSongVote[] })[] = [];
  let userVote = null;
  let IsVoteCreationEnabled = false;
  let canDeleteAll = false;
  let IsVotingEnabled = false;
  let canDownload = false;
  let base_url = "";

  if (session?.user) {
    votes = await DatabaseClient.endSongVoteRequest.findMany({
      include: {
        votes: true,
        user: true,
      },
      orderBy: {
        votes: {
          _count: "desc",
        },
      },
    });

    userVote = await DatabaseClient.endSongVote.findFirst({
      where: { voterId: session.user.id },
    });

    IsVotingEnabled = await IsFeatureEnabled(AppFeatures.Voting, session.user);

    canDeleteAll = await IsFeatureEnabled(
      AppFeatures.GroupSongRequestAdmin,
      session.user
    );
    canDownload = await IsFeatureEnabled(
      AppFeatures.DownloadSong,
      session.user
    );

    IsVoteCreationEnabled = await IsFeatureEnabled(
      AppFeatures.VoteSongRequestCreation,
      session.user
    );

    base_url = process.env.FILE_SERVER_URL ?? "";
  }

  return (
    <Base>
      <Card className="">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold flex flex-row place-content-between w-full">
            <p></p>
            <p>Die Ablauf Songs</p>
            <EndVoteSongCreateDialog disabled={!IsVoteCreationEnabled} />
          </CardTitle>
          <CardDescription className="w-fit">
            Hier kannst du das gemeinsame Ablauf Lied wählen, das du haben möchtest. Du
            kannst gleichzeitig nur ein Lied wählen. Hierfür braucht du keine
            Credits.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center">
          {session ? (
            <EndVotingTable
              userId={session.user.id}
              vote={userVote}
              canDeleteAll={canDeleteAll}
              //@ts-expect-error
              songRequests={votes}
              votingEnabled={IsVotingEnabled}
              base_url={base_url}
              canDownload={canDownload}
            />
          ) : (
            <p className="text-red-500">Bitte einloggen</p>
          )}
        </CardContent>
      </Card>
    </Base>
  );
}
