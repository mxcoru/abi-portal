"use client";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createVoteSong } from "@/app/votes/actions";
import { formatSeconds, getSecondsFromTime } from "@/lib/format";
import { Plus } from "lucide-react";

export function VoteSongCreateDialog({
  disabled,
}: {
  disabled?: boolean;
}) {

  let song = {
    start: 0,
    end: 0,
    title: "",
    url: "",
  };

  async function handleClick() {
    let result = await createVoteSong(song);

    if (!result.success) {
      toast.error(result.error);
    } else {
      window.location.reload();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          variant={"default"}
          className="rounded-full"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gruppen Einlauf Song erstellen</DialogTitle>
          <DialogDescription>
            Hier kannst du ein Einlauf Song einreichen
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Titel
            </Label>
            <Input
              id="name"
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
              Start Sekunde
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
              End Sekunde
            </Label>
            <Input
              id="name"
              defaultValue={formatSeconds(song.start)}
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
