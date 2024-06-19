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
import { createTimetableEntry } from "@/app/timetable/actions";
import { Plus } from "lucide-react";
import { Action, Prisma } from "@prisma/client";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";

export function TimetableEntryCreateDialog({
  disabled,
}: {
  disabled?: boolean;
}) {

  let timetableEntry: Prisma.TimetableEntryCreateInput = {
    name: "",
    action: Action.NONE,
    order: 0
  };

  async function handleClick() {
    let result = await createTimetableEntry(timetableEntry);

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
          <DialogTitle>Einen Zeitplan Eintrag erstellen</DialogTitle>
          <DialogDescription>
            Hier kannst du deinen Zeitplan Eintrag erstellen
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              type="text"
              onChange={(e) => (timetableEntry.name = e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Aktions Seite
            </Label>
            <Select defaultValue={Action.NONE} onValueChange={(e) => (timetableEntry.action = e as Action)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Wähle eine Seite" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Action.NONE}>Keine</SelectItem>
                <SelectItem value={Action.GROUP_SONG_PAGE}>Gruppen Einlauf Song</SelectItem>
                <SelectItem value={Action.USER_SONG_PAGE}>Schüler Einlauf Song</SelectItem>
                <SelectItem value={Action.GROUP_END_SONG_PAGE}>Gruppen Ablauf Song</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Ordnungs
              Nummer
            </Label>
            <Input
              id="name"
              defaultValue={0}
              className="col-span-3"
              type="number"
              onChange={(e) =>
                (timetableEntry.order = e.target.valueAsNumber)
              }
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
