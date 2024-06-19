"use client";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Action, TimetableEntry } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTimetableEntry, updateTimetableEntryOrder, deleteTimetableEntry } from "@/app/timetable/actions";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
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

export function TimetableActions({ timetableEntry }: { timetableEntry: TimetableEntry }) {
  return (
    <>
      <TimetableNewOrderDialog timetableEntry={timetableEntry} />
      <TimetableEntryEditDialoag timetableEntry={timetableEntry} />
      <TimetableDeleteDialog timetableEntry={timetableEntry} />
    </>
  );
}

function TimetableEntryEditDialoag({ timetableEntry }: { timetableEntry: TimetableEntry }) {
  async function handleClick() {
    let result = await updateTimetableEntry(timetableEntry.id, timetableEntry);

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
            Hier kannst du den Zeitplan Eintrag bearbeiten. Du kannst den Namen und die Aktion ändern.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={timetableEntry.name}
              className="col-span-3"
              type="text"
              onChange={(e) => (timetableEntry.name = e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Aktions Seite
            </Label>
            <Select defaultValue={timetableEntry.action} onValueChange={(e) => (timetableEntry.action = e as Action)}>
              <SelectTrigger className="w-[180px]" >
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

function TimetableNewOrderDialog({ timetableEntry }: { timetableEntry: TimetableEntry }) {
  let order = timetableEntry.order;

  async function handleClick() {
    let result = await updateTimetableEntryOrder(timetableEntry.id, order);

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

function TimetableDeleteDialog({ timetableEntry }: { timetableEntry: TimetableEntry }) {
  async function handleClick() {
    let result = await deleteTimetableEntry(timetableEntry.id);

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
