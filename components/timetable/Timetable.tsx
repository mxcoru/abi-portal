import { Action, TimetableEntry } from "@prisma/client";
import { TimetableActions } from "./TimetableAction";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function GetTimetableEntryAction(action: Action) {
  switch (action) {
    case Action.NONE:
      return "Keine";
    case Action.GROUP_SONG_PAGE:
      return "Gruppen Einlauf Song";
    case Action.USER_SONG_PAGE:
      return "Schüler Einlauf Songs";
    case Action.GROUP_END_SONG_PAGE:
      return "Gruppen Ablauf Song";
  }
}

function TimetableEntryRow({ timetableEntry }: { timetableEntry: TimetableEntry }) {
  return (
    <TableRow key={timetableEntry.id}>
      <TableCell>
        {timetableEntry.order}
      </TableCell>
      <TableCell>{timetableEntry.name}</TableCell>
      <TableCell>{GetTimetableEntryAction(timetableEntry.action)}</TableCell>
      <TableCell>
        <TimetableActions timetableEntry={timetableEntry} />
      </TableCell>
    </TableRow>
  );
}

function EmptyTimetableEntryRow() {
  return (
    <TableRow>
      <TableCell colSpan={5}>
        <p className="text-center">Es gibt noch keine Einträge</p>
      </TableCell>
    </TableRow>
  );
}

export function Timetable({ timetableEntries }: { timetableEntries: TimetableEntry[] }) {
  let ShouldDisplayEmptyRow = timetableEntries.length == 0;

  return (
    <Table className="overflow-y-auto">
      <TableCaption>
        Du möchtest du was ändern oder hinzufügen?
        Bitte wende dich an eine Person aus der Finanzgruppe
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Ordnungsnummer</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Aktions Seite</TableHead>
          <TableHead className="text-center">Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody key={"user-song-table-body"}>
        {ShouldDisplayEmptyRow ? (
          <EmptyTimetableEntryRow key={"empty-song-row"} />
        ) : (
          timetableEntries.map((timetableEntry) => <TimetableEntryRow key={timetableEntry.id} timetableEntry={timetableEntry} />)
        )}
      </TableBody>
    </Table>
  );
}
