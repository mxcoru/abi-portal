import { Song, SongStatus } from "@prisma/client";
import { SongActions } from "./SongAction";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function GetSongStatus({ status }: { status: SongStatus }) {
  switch (status) {
    case SongStatus.FINISHED:
      return <p className="text-green-500">Fertig</p>;
    case SongStatus.REQUESTED:
      return <p className="text-yellow-500">In Bearbeitung</p>;
    case SongStatus.DECLINED:
      return <p className="text-red-500">Abgelehnt</p>;
    default:
      return <p className="text-blue-500">Unbekannt</p>;
  }
}

function UserSongRow({ song, base_url }: { song: Song, base_url: string }) {
  return (
    <TableRow key={song.id}>
      <TableCell>
        <GetSongStatus status={song.status} />
      </TableCell>
      <TableCell>{song.title}</TableCell>
      <TableCell className="hidden md:table-cell">{song.url}</TableCell>
      <TableCell>
        <SongActions song={song} song_url={song.status == SongStatus.FINISHED ? `${base_url}/${song.fileId}.mp3` : ""} />
      </TableCell>
    </TableRow>
  );
}

function EmptySongRow() {
  return (
    <TableRow>
      <TableCell colSpan={5}>
        <p className="text-center">Du hast noch keine Songs</p>
      </TableCell>
    </TableRow>
  );
}

export function UserSongTable({ songs, base_url }: { songs: Song[], base_url: string }) {
  let ShouldDisplayEmptyRow = songs.length == 0;

  return (
    <Table className="overflow-y-auto">
      <TableCaption>
        Hier sind deine Songs, wenn du Hilfe brauchst wende dich bitte an die
        Finanzgruppe
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Status</TableHead>
          <TableHead>Titel</TableHead>
          <TableHead className="hidden md:table-cell">Url</TableHead>
          <TableHead className="text-center">Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody key={"user-song-table-body"}>
        {ShouldDisplayEmptyRow ? (
          <EmptySongRow key={"empty-song-row"} />
        ) : (
          songs.map((song) => <UserSongRow key={song.id} song={song} base_url={base_url} />)
        )}
      </TableBody>
    </Table>
  );
}
