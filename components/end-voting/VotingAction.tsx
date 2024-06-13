"use client";
import React from "react";
import { toast } from "sonner";
import { deleteEndSongVoteRequest, downloadGroupEndSong, voteForEndSong } from "@/app/actions";
import { Download, ExternalLink, ScrollText, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { EndSongVoteRequest } from "@prisma/client";
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
  canDownload,
  base_url,
}: {
  voteRequest: EndSongVoteRequest;
  userId: string;
  canDeleteAll: boolean;
  canDownload: boolean;
  votingEnabled: boolean;
  base_url: string;
}) {
  return (
    <>
      <VoteSongDialog voteRequest={voteRequest} disabled={!votingEnabled} />
      {(canDeleteAll || userId == voteRequest.creatorId) && (
        <DeleteVoteSongDialog voteRequest={voteRequest} />
      )}
      {(canDownload && !voteRequest.finished) && <DownloadSongDialog voteRequest={voteRequest} />}
      {voteRequest.finished && <ViewDownloadLink song_url={`${base_url}/${voteRequest.fileId}.mp3`} />}
    </>
  );
}

function DownloadSongDialog({ voteRequest }: { voteRequest: EndSongVoteRequest }) {
  async function handleClick() {
    let result = await downloadGroupEndSong(voteRequest.id);

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
          <Download className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bist du dier sicher?</AlertDialogTitle>
          <AlertDialogDescription>
            Wenn du den Song herunterladen, kann es nicht wieder rückgängig
            gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Herunterladen</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ViewDownloadLink({ song_url }: { song_url: string }) {
  function handleClick() {
    window.open(song_url, "_blank");
  }

  if (song_url) {
    return (
      <Button variant={"ghost"} onClick={handleClick}>
        <ExternalLink className="h-4 w-4" />
      </Button>
    );
  }
}

function VoteSongDialog({
  voteRequest,
  disabled: disabled,
}: {
  voteRequest: EndSongVoteRequest;
  disabled: boolean;
}) {
  async function handleClick() {
    let result = await voteForEndSong(voteRequest.id);

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
  voteRequest: EndSongVoteRequest;
}) {
  async function handleClick() {
    let result = await deleteEndSongVoteRequest(song.id);

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
