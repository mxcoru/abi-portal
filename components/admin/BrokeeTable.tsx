import { Song, User } from "@prisma/client";
import { BrokeeAction } from "./BrokeeActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function BrokeRow({
  user,
  canAddCredits,
}: {
  user: User;
  canAddCredits: boolean;
}) {
  return (
    <TableRow>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <BrokeeAction userId={user.id} cannAddCredits={canAddCredits} />
      </TableCell>
    </TableRow>
  );
}

function EmptyBrokeeRow() {
  return (
    <TableRow>
      <TableCell colSpan={5}>
        <p className="text-green-500 text-center">
          Alles sieht gut aus, keiner ist Pleite
        </p>
      </TableCell>
    </TableRow>
  );
}

export function BrokeeTable({
  users,
  canAddCredits,
}: {
  users: User[];
  canAddCredits: boolean;
}) {
  let ShouldDisplayEmptyRow = users.length == 0;

  return (
    <Table className="overflow-y-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Name</TableHead>
          <TableHead className="text-center w-[200px]">Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody key={"user-song-table-body"}>
        {ShouldDisplayEmptyRow ? (
          <EmptyBrokeeRow key={"empty-song-row"} />
        ) : (
          users.map((user) => (
            <BrokeRow key={user.id} user={user} canAddCredits={canAddCredits} />
          ))
        )}
      </TableBody>
    </Table>
  );
}
