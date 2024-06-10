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

import { MobileNavigationBar } from "./MobileNavbar";
import { DeleteAllUserCredits } from "./admin/DeleteAllUserCredits";
import { SetUserCredits } from "./admin/SetUserCredits";

export async function NavigationBar() {
  const session = await getServerSession(authOptions);

  let credits = 0;
  let IsSongCreationEnabled = false;
  let IsVoteSongRequestCreationEnabled = false;
  let IsDeleteAllUserCreditsEnabled = false;
  let CanSetCredits = false;
  let IsAuthEnabled = await IsFeatureEnabled(
    AppFeatures.Authentication,
    session?.user ?? null
  );

  if (session?.user) {
    IsSongCreationEnabled = await IsFeatureEnabled(
      AppFeatures.SongCreation,
      session?.user ?? null
    );

    IsVoteSongRequestCreationEnabled = await IsFeatureEnabled(
      AppFeatures.VoteSongRequestCreation,
      session?.user ?? null
    );

    IsDeleteAllUserCreditsEnabled = await IsFeatureEnabled(
      AppFeatures.DeleteAllUserCredits,
      session?.user ?? null
    );

    CanSetCredits = await IsFeatureEnabled(
      AppFeatures.SetUserCredits,
      session?.user ?? null
    );

    credits = await getUserCredits();
  }

  return (
    <>
      <NormalNavigationBar
        admin={IsUserAdmin(session?.user ?? { role: UserRole.MEMBER })}
        song_creation={IsSongCreationEnabled}
        user={session?.user}
        is_auth_enabled={IsAuthEnabled}
        vote_song_creation={IsVoteSongRequestCreationEnabled}
        delete_all_user_credits={IsDeleteAllUserCreditsEnabled}
        set_user_credits={CanSetCredits}
        credits={credits}
      />
      <MobileNavigationBar
        admin={IsUserAdmin(session?.user ?? { role: UserRole.MEMBER })}
        song_creation={IsSongCreationEnabled}
        user={session?.user}
        is_auth_enabled={IsAuthEnabled}
        vote_song_creation={IsVoteSongRequestCreationEnabled}
        delete_all_user_credits={IsDeleteAllUserCreditsEnabled}
        set_user_credits={CanSetCredits}
        credits={credits}
      />
    </>
  );
}

function NormalNavigationBar({
  admin,
  song_creation,
  user,
  vote_song_creation,
  credits,
  is_auth_enabled,
  delete_all_user_credits,
  set_user_credits,
}: {
  admin?: boolean;
  song_creation?: boolean;
  is_auth_enabled: boolean;
  delete_all_user_credits?: boolean;
  set_user_credits?: boolean;
  user?: {
    id: string;
    name: string;
    role: UserRole;
    email: string;
  };
  vote_song_creation?: boolean;
  credits?: number;
}) {
  return (
    <div className="hidden md:grid grid-cols-12 w-72 h-full">
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
            <Link href="/">Deine Einlauf Songs</Link>
            <Link href="/votes">Gruppen Einlauf Songs</Link>
            {admin && <Link href="/admin">Admin Panel</Link>}
            <p className="mt-2"></p>
            <SongCreateDialog
              key={"song-create-dialog"}
              disabled={!user || !song_creation}
            />
            <VoteSongCreateDialog
              key={"vote-song-create-dialog"}
              disabled={!user || !vote_song_creation}
            />
            {delete_all_user_credits && <DeleteAllUserCredits />}
            {set_user_credits && (
              <SetUserCredits canSetCredits={set_user_credits} />
            )}
          </div>
        </div>

        <div className="mb-3 flex flex-col items-center text-left w-full mx-5">
          {user && (
            <div className="mb-2 tracking-wider">
              <p>Hallo {user?.name}</p>
              <p>Deine Credits: {credits}</p>
            </div>
          )}
          <div className="w-2/3">
            <AuthButton isAuthEnabled={is_auth_enabled} isLoggedIn={!!user} />
          </div>
        </div>
      </div>
      <div className="w-1 bg-gray-700 my-5 rounded-xl col-start-12" />
    </div>
  );
}
