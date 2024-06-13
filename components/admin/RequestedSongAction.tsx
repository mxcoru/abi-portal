"use client";
import React from "react";
import { toast } from "sonner";
import { declineSong, downloadSong } from "@/app/actions";
import { Download, X } from "lucide-react";
import { Button } from "../ui/button";
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

export function RequestSongAction({ songId, download }: { songId: string, download?: boolean }) {
  return (
    <>
      <DownloadSongDialoag songId={songId} download={download} />
      <DeclineSongDialoag songId={songId} />
    </>
  );
}



function DownloadSongDialoag({ songId, download }: { songId: string, download?: boolean }) {
  async function handleClick() {
    let result = await downloadSong(songId);

    if (!result.success) {
      toast.error(result.error);
    } else {
      window.location.reload();
    }
  }


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} disabled={!download}>
          <Download className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Möchtest du diesen Song herunterladen?</AlertDialogTitle>
          <AlertDialogDescription>
            Hiermit wird die Song heruntergeladen und in deinem Download-Ordner
            kopiert.
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

function DeclineSongDialoag({ songId }: { songId: string }) {
  async function handleClick() {
    let result = await declineSong(songId);

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
          <X className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Möchtest du diesen Song ablehnen?</AlertDialogTitle>
          <AlertDialogDescription>
            Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Ablehnen</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
