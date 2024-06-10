import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { DatabaseClient } from "@/lib/database";
import { VotingTable } from "@/components/voting/VotingTable";
import { IsFeatureEnabled } from "@/lib/feature";
import { AppFeatures } from "@/lib/config/feature";
import { SongVote, SongVoteRequest } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Base } from "@/components/Base";

export default async function Home() {
  const session = await getServerSession(authOptions);

  let votes: (SongVoteRequest & { votes: SongVote[] })[] = [];
  let userVote = null;
  let canDeleteAll = false;
  let IsVotingEnabled = false;

  if (session?.user) {
    votes = await DatabaseClient.songVoteRequest.findMany({
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
    userVote = await DatabaseClient.songVote.findFirst({
      where: { voterId: session.user.id },
    });
    IsVotingEnabled = await IsFeatureEnabled(AppFeatures.Voting, session.user);
    canDeleteAll = await IsFeatureEnabled(
      AppFeatures.GroupSongRequestAdmin,
      session.user
    );
  }

  return (
    <Base>
      <Card className="">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">Die Einlauf Songs</CardTitle>
          <CardDescription className="w-fit">
            Hier kannst du das Einlauf Lied wählen, das du haben möchtest. Du
            kannst gleichzeitig nur ein Lied wählen. Hierfür braucht du keine
            Credits.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center">
          {session ? (
            <VotingTable
              userId={session.user.id}
              vote={userVote}
              canDeleteAll={canDeleteAll}
              //@ts-expect-error
              songRequests={votes}
              votingEnabled={IsVotingEnabled}
            />
          ) : (
            <p className="text-red-500">Bitte einloggen</p>
          )}
        </CardContent>
      </Card>
    </Base>
  );
}
