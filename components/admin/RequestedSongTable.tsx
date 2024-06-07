import { Song } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatSeconds } from "@/lib/format";
import { RequestSongAction } from "./RequestedSongAction";

function RequestSongRow({ song }: { song: Song }) {
  return (
    <TableRow>
      <TableCell>{song.title}</TableCell>
      <TableCell>{song.url}</TableCell>
      <TableCell>{formatSeconds(song.start)}</TableCell>
      <TableCell>{formatSeconds(song.end)}</TableCell>
      <TableCell>
        <RequestSongAction songId={song.id} />
      </TableCell>
    </TableRow>
  );
}

function EmptyRequestedSongRow() {
  return (
    <TableRow>
      <TableCell colSpan={5}>
        <p className="text-green-500 text-center">
          Alles sieht gut aus, alle Songs wurden bearbeitet
        </p>
      </TableCell>
    </TableRow>
  );
}

export function RequestedSongTable({ songs }: { songs: Song[] }) {
  let ShouldDisplayEmptyRow = songs.length == 0;

  return (
    <Table className="">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Titel</TableHead>
          <TableHead className="text-left">URL</TableHead>
          <TableHead className="text-left">Start</TableHead>
          <TableHead className="text-left">Ende</TableHead>
          <TableHead className="text-center">Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {ShouldDisplayEmptyRow ? (
          <EmptyRequestedSongRow key={"empty-song-row"} />
        ) : (
          songs.map((song) => <RequestSongRow key={song.id} song={song} />)
        )}
      </TableBody>
    </Table>
  );
}
