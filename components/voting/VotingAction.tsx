"use client";
import React from "react";
import { toast } from "sonner";
import { deleteSongVoteRequest, voteForSong } from "@/app/actions";
import { ScrollText, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { SongVoteRequest } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function VoteAction({
  voteRequest,
  userId,
  canDeleteAll,
  votingEnabled,
}: {
  voteRequest: SongVoteRequest;
  userId: string;
  canDeleteAll: boolean;
  votingEnabled: boolean;
}) {
  return (
    <>
      <VoteSongDialog voteRequest={voteRequest} disabled={!votingEnabled} />
      {(canDeleteAll || userId == voteRequest.creatorId) && (
        <DeleteVoteSongDialog voteRequest={voteRequest} />
      )}
    </>
  );
}

function VoteSongDialog({
  voteRequest,
  disabled: disabled,
}: {
  voteRequest: SongVoteRequest;
  disabled: boolean;
}) {
  async function handleClick() {
    let result = await voteForSong(voteRequest.id);

    if (!result.success) {
      toast.error(result.error);
    } else {
      window.location.reload();
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} disabled={disabled}>
          <ScrollText className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bist du dier sicher?</AlertDialogTitle>
          <AlertDialogDescription>
            Wenn du schon gewählt hast, wird diese Wahl hiermit geändert.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Wählen</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteVoteSongDialog({
  voteRequest: song,
}: {
  voteRequest: SongVoteRequest;
}) {
  async function handleClick() {
    let result = await deleteSongVoteRequest(song.id);

    if (!result.success) {
      toast.error(result.error);
    } else {
      window.location.reload();
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bist du dier sicher?</AlertDialogTitle>
          <AlertDialogDescription>
            Wenn du den Song löscht, kann es nicht wieder rückgängig gemacht
            werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Löschen</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
