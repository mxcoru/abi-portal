import { Song, SongStatus, User } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function GetUserStatus({
  request_songs,
  declined_songs,
}: {
  request_songs: number;
  declined_songs: number;
}) {
  return (
    <>
      {request_songs == 0 && declined_songs == 0 && (
        <p className="text-red-500">Keine Songs eingereicht</p>
      )}
      {request_songs > 0 && (
        <p className="text-yellow-500">{request_songs} Songs In Bearbeitung</p>
      )}
      {declined_songs > 0 && (
        <p className="text-red-500">{declined_songs} Songs Abgelehnt</p>
      )}
    </>
  );
}

function UserSongRow({ user }: { user: User & { songs: Song[] } }) {
  let requested_songs = user.songs.filter(
    (song) => song.status == SongStatus.REQUESTED
  ).length;
  let declined_songs = user.songs.filter(
    (song) => song.status == SongStatus.DECLINED
  ).length;
  return (
    <TableRow>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <GetUserStatus
          request_songs={requested_songs}
          declined_songs={declined_songs}
        />
      </TableCell>
    </TableRow>
  );
}

function EmptyUserRow() {
  return (
    <TableRow>
      <TableCell colSpan={5}>
        <p className="text-green-500 text-center">
          Alles sieht gut, jeder hat einen Song eingetragen
        </p>
      </TableCell>
    </TableRow>
  );
}

export function NoSongTable({
  users,
}: {
  users: (User & { songs: Song[] })[];
}) {
  let ShouldDisplayEmptyRow = users.length == 0;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Name</TableHead>
          <TableHead className="text-center w-[200px]">Grund</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody key={"user-song-table-body"}>
        {ShouldDisplayEmptyRow ? (
          <EmptyUserRow key={"empty-song-row"} />
        ) : (
          users.map((user) => <UserSongRow key={user.id} user={user} />)
        )}
      </TableBody>
    </Table>
  );
}
