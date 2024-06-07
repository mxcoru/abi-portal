import { NavigationBar } from "@/components/NavigationBar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { DatabaseClient } from "@/lib/database";
import { AuthButton } from "@/components/auth";
import { VotingTable } from "@/components/voting/VotingTable";
import { IsFeatureEnabled } from "@/lib/feature";
import { AppFeatures } from "@/lib/config/feature";
import { SongVoteRequest } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const session = await getServerSession(authOptions);

  let votes: SongVoteRequest[] = [];
  let userVote = null;
  let canDeleteAll = false;
  let IsVotingEnabled = false;

  if (session?.user) {
    votes = await DatabaseClient.songVoteRequest.findMany();
    userVote = await DatabaseClient.songVote.findFirst({
      where: { voterId: session.user.id },
    });
    IsVotingEnabled = await IsFeatureEnabled(AppFeatures.Voting, session.user);
    canDeleteAll = await IsFeatureEnabled(
      AppFeatures.VotingAdmin,
      session.user
    );
  }

  return (
    <div className="w-full h-svh flex flex-row">
      <NavigationBar />
      <div className="w-5/6 h-svh flex flex-col justify-center items-center">
        <Card className="">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold">
              Die Einlauf Songs
            </CardTitle>
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
                songRequests={votes}
                votingEnabled={IsVotingEnabled}
              />
            ) : (
              <AuthButton />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
