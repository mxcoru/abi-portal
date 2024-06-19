import Link from "next/link";
import { getServerSession } from "next-auth";
import { AuthButton } from "./auth";
import { authOptions } from "@/lib/auth";
import { getUserCredits } from "@/app/actions";
import { IsFeatureEnabled } from "@/lib/feature";
import { AppFeatures } from "@/lib/config/feature";
import { IsUserAdmin } from "@/lib/utils";
import { UserRole } from "@prisma/client";
import { MobileNavigationBar } from "./MobileNavbar";

export async function NavigationBar() {
  const session = await getServerSession(authOptions);

  let credits = 0;
  let IsAuthEnabled = await IsFeatureEnabled(
    AppFeatures.Authentication,
    session?.user ?? null
  );

  let IsLiveviewEnabled = await IsFeatureEnabled(
    AppFeatures.Liveview,
    session?.user ?? null
  );

  let IsLiveviewControllerEnabled = await IsFeatureEnabled(
    AppFeatures.LiveviewController,
    session?.user ?? null
  );

  let IsTimetableEnabled = await IsFeatureEnabled(
    AppFeatures.ViewTimetable,
    session?.user ?? null
  );


  if (session?.user) {
    credits = await getUserCredits();
  }

  return (
    <>
      <NormalNavigationBar
        admin={IsUserAdmin(session?.user ?? { role: UserRole.MEMBER })}
        user={session?.user}
        is_auth_enabled={IsAuthEnabled}
        is_liveview_enabled={IsLiveviewEnabled}
        is_liveview_controller_enabled={IsLiveviewControllerEnabled}
        is_timetable_enabled={IsTimetableEnabled}
        credits={credits}
      />
      <MobileNavigationBar
        admin={IsUserAdmin(session?.user ?? { role: UserRole.MEMBER })}
        user={session?.user}
        is_auth_enabled={IsAuthEnabled}
        is_liveview_enabled={IsLiveviewEnabled}
        is_liveview_controller_enabled={IsLiveviewControllerEnabled}
        is_timetable_enabled={IsTimetableEnabled}
        credits={credits}
      />
    </>
  );
}

function NormalNavigationBar({
  admin,
  user,
  credits,
  is_auth_enabled,
  is_liveview_enabled,
  is_liveview_controller_enabled,
  is_timetable_enabled,
}: {
  admin?: boolean;
  is_auth_enabled: boolean;
  is_liveview_enabled: boolean;
  is_liveview_controller_enabled: boolean;
  is_timetable_enabled: boolean;
  user?: {
    id: string;
    name: string;
    role: UserRole;
    email: string;
  };
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
            <Link href="/end-votes">Gruppen Ablauf Songs</Link>
            {is_liveview_controller_enabled && <Link href="/controller">Liveview Controller</Link>}
            {is_liveview_enabled && <Link href="/liveview">Liveview Display</Link>}
            {is_timetable_enabled && <Link href="/timetable">Abi Zeitplan</Link>}
            {admin && <Link href="/admin">Admin Panel</Link>}
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
