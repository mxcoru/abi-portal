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
import { createSong } from "@/app/actions";
import { formatSeconds, getSecondsFromTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export function SongCreateDialog({
  disabled,
  big,
}: {
  disabled?: boolean;
  big?: boolean;
}) {
  if (disabled) {
    return <p className="text-muted">Perönlichen Song einreichen</p>;
  }

  let song = {
    start: 0,
    end: 0,
    title: "",
    url: "",
  };

  async function handleClick() {
    let result = await createSong(song);

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
          variant={"secondary"}
          className={cn("w-full", big && "text-xl h-12")}
        >
          Perönlichen Song einreichen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deinen Song einreichen</DialogTitle>
          <DialogDescription>
            Hier kannst du deinen Perönlichen Song einreichen
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
