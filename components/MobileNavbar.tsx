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

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MEMBER";

export function MobileNavigationBar({
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
  vote_song_creation?: boolean;
  is_auth_enabled: boolean;
  delete_all_user_credits?: boolean;
  set_user_credits?: boolean;
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
                <a href="/">Deiner Einlauf Songs</a>
                <a href="/votes">Gruppen Einlauf Songs</a>
                {admin && <a href="/admin">Admin Panel</a>}
                <p className="mt-2"></p>
                <SongCreateDialog disabled={!user || !song_creation} big />
                <VoteSongCreateDialog
                  disabled={!user || !vote_song_creation}
                  big
                />

                {delete_all_user_credits && <DeleteAllUserCredits big />}
                {set_user_credits && (
                  <SetUserCredits canSetCredits={set_user_credits} big />
                )}
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
