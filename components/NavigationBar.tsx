import Link from "next/link";
import { getServerSession } from "next-auth";
import { AuthButton } from "./auth";
import { authOptions } from "@/lib/auth";
import { SongCreateDialog } from "./songs/SongCreateDialoag";
import { getUserCredits } from "@/app/actions";
import { IsFeatureEnabled } from "@/lib/feature";
import { AppFeatures } from "@/lib/config/feature";
import { IsUserAdmin } from "@/lib/utils";
import { UserRole } from "@prisma/client";
import { VoteSongCreateDialog } from "./voting/CreateVoteDialog";

export async function NavigationBar() {
  const session = await getServerSession(authOptions);

  let IsSongCreationEnabled = false;
  let IsVoteSongRequestCreationEnabled = false;
  let credits = 0;

  if (session?.user) {
    IsSongCreationEnabled = await IsFeatureEnabled(
      AppFeatures.SongCreation,
      session?.user ?? null
    );

    IsVoteSongRequestCreationEnabled = await IsFeatureEnabled(
      AppFeatures.VoteSongRequestCreation,
      session?.user ?? null
    );

    credits = await getUserCredits(session.user.id);
  }

  return (
    <div className="grid grid-cols-12 w-72 h-full">
      <div className="col-start-1 col-span-11 p-2 flex flex-col items-center place-content-between">
        <div>
          <h1 className="text-xl text-center mt-3 font-semibold tracking-widest">
            Abitendo
          </h1>
          <p className="text-muted-foreground text-sm text-center">
            Dein Abitur Portal 2024
          </p>
        </div>

        <div className="mt-3 flex flex-col items-center">
          <div className="flex flex-col text-center tracking-widest gap-2">
            <Link href="/">Deine Songs</Link>
            <Link href="/votes">Einflauf Lied</Link>
            {IsUserAdmin(session?.user ?? { role: UserRole.MEMBER }) && (
              <Link href="/admin">Admin Panel</Link>
            )}
            <p className="mt-2"></p>
            <SongCreateDialog
              key={"song-create-dialog"}
              userId={session?.user?.id ?? ""}
              disabled={!session || !IsSongCreationEnabled}
            />
            <VoteSongCreateDialog
              key={"vote-song-create-dialog"}
              userId={session?.user?.id ?? ""}
              disabled={!session || !IsVoteSongRequestCreationEnabled}
            />
          </div>
        </div>

        <div className="mb-3 flex flex-col items-center text-left w-full mx-5">
          {session?.user && (
            <div className="mb-2 tracking-wider">
              <p>Hallo {session?.user?.name}</p>
              <p>Deine Credits: {credits}</p>
            </div>
          )}
          <div className="w-2/3">
            <AuthButton />
          </div>
        </div>
      </div>
      <div className="w-1 bg-gray-700 my-5 rounded-xl col-start-12" />
    </div>
  );
}
