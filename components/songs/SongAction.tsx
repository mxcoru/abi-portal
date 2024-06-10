"use client";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Song } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteSong, updateSong, updateSongOrder } from "@/app/actions";
import { formatSeconds, getSecondsFromTime } from "@/lib/format";
import { ArrowDownUp, Trash2, Pencil } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SongActions({ song }: { song: Song }) {
  return (
    <>
      <SongNewOrderDialog song={song} />
      <SongEditDialog song={song} />
      <SongDeleteDialog song={song} />
    </>
  );
}

function SongEditDialog({ song }: { song: Song }) {
  async function handleClick() {
    let result = await updateSong(song.id, song);

    if (!result.success) {
      toast.error(result.error);
    } else {
      window.location.reload();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bearbeite den Song</DialogTitle>
          <DialogDescription>
            Hier kannst du deinen Song bearbeiten. Du kannst den Titel, den
            Text, die Zeit und die Bilder ändern.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Titel
            </Label>
            <Input
              id="name"
              defaultValue={song.title}
              className="col-span-3"
              type="text"
              onChange={(e) => (song.title = e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Url
            </Label>
            <Input
              id="name"
              defaultValue={song.url}
              className="col-span-3"
              type="text"
              onChange={(e) => (song.url = e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Start
            </Label>
            <Input
              id="name"
              defaultValue={formatSeconds(song.start)}
              className="col-span-3"
              type="string"
              onChange={(e) =>
                (song.start = getSecondsFromTime(e.target.value))
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Ende
            </Label>
            <Input
              id="name"
              defaultValue={formatSeconds(song.end)}
              className="col-span-3"
              type="string"
              onChange={(e) => (song.end = getSecondsFromTime(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleClick}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SongNewOrderDialog({ song }: { song: Song }) {
  let order = song.order;

  async function handleClick() {
    let result = await updateSongOrder(song.id, order);

    if (!result.success) {
      toast.error(result.error);
    } else {
      window.location.reload();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ändere die Reihenfolge</DialogTitle>
          <DialogDescription>
            Je höher die Ordnungsnummer, desto höher ist die Position in der
            Reihenfolge deiner Songs. Diese Aktion braucht keine Credits.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Ordnungsnummer
            </Label>
            <Input
              id="name"
              className="col-span-3"
              type="number"
              defaultValue={order}
              onChange={(e) => (order = e.target.valueAsNumber)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleClick}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SongDeleteDialog({ song }: { song: Song }) {
  async function handleClick() {
    let result = await deleteSong(song.id);

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
            Diese Aktion kann nicht rückgängig gemacht werden. Dieser Vorgang
            löscht den Song und entfernt es vom Server.
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
