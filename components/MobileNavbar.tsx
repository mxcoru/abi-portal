"use client";

import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AuthButton } from "./auth";
import { SongCreateDialog } from "./songs/SongCreateDialoag";
import { VoteSongCreateDialog } from "./voting/CreateVoteDialog";
import { DeleteAllUserCredits } from "./admin/DeleteAllUserCredits";
import { SetUserCredits } from "./admin/SetUserCredits";
import { DownloadAllSongs } from "./admin/DownloadAllSongs";
import { EndVoteSongCreateDialog } from "./end-voting/CreateVoteDialog";
import Link from "next/link";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MEMBER";

export function MobileNavigationBar({
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
  let [IsOpen, setIsOpen] = useState(false);

  return (
    <div className="z-30 fixed bottom-0 right-0 md:hidden">
      <Button
        className={cn("rounded-full w-16 h-16 m-3", IsOpen && "hidden")}
        variant={"outline"}
        onClick={() => setIsOpen(!IsOpen)}
      >
        <Menu className="text-5xl" />
      </Button>
      <div className={cn(" bg-background hidden", IsOpen && "block")}>
        <div className="z-50 fixed bottom-0 right-0">
          <Button
            className={cn("rounded-full w-16 h-16 m-3", !IsOpen && "hidden")}
            variant={"outline"}
            onClick={() => setIsOpen(!IsOpen)}
          >
            <X className="text-5xl" />
          </Button>
        </div>

        <div className="w-screen h-screen flex flex-col justify-center items-center">
          <div className="p-2 flex flex-col items-center w-full h-full place-content-between">
            <div className="">
              <h1 className="text-5xl text-center mt-3 font-semibold tracking-widest">
                Abitendo
              </h1>
              <p className="text-muted-foreground text-center text-xl">
                Dein Abitur Portal 2024
              </p>
            </div>

            <div className="mt-3 flex flex-col items-center text-xl font-semibold">
              <div className="flex flex-col text-center tracking-widest gap-2">
                <Link href="/">Deine Einlauf Songs</Link>
                <Link href="/votes">Gruppen Einlauf Songs</Link>
                <Link href="/end-votes">Gruppen Ablauf Songs</Link>
                {is_liveview_controller_enabled && <Link href="/controller">Zum Controller</Link>}
                {is_liveview_enabled && <Link href="/liveview">Zum Liveview</Link>}
                {is_timetable_enabled && <Link href="/timetable">Zum Zeitplan</Link>}
                {admin && <a href="/admin">Admin Panel</a>}
              </div>
            </div>

            <div className="mb-3 flex flex-col items-center text-left w-full mx-5 text-xl">
              {user && (
                <div className="mb-2 tracking-wider">
                  <p>Hallo {user?.name}</p>
                  <p>Deine Credits: {credits}</p>
                </div>
              )}
              <div className="w-2/3">
                <AuthButton
                  isAuthEnabled={is_auth_enabled}
                  isLoggedIn={!!user}
                  big
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
