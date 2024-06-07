import { SongVote, SongVoteRequest } from "@prisma/client";
import { VoteAction } from "./VotingAction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatSeconds } from "@/lib/format";

function VoteRow({
  voteRequest: song,
  voted,
  userId,
  canDeleteAll,
  votingEnabled,
}: {
  voteRequest: SongVoteRequest;
  voted: boolean;
  userId: string;
  canDeleteAll: boolean;
  votingEnabled: boolean;
}) {
  return (
    <TableRow key={song.id}>
      <TableCell className="text-center w-100  ">
        {voted ? (
          <span className="text-green-500">Ja</span>
        ) : (
          <span className="text-red-500">Nein</span>
        )}
      </TableCell>
      <TableCell>{song.title}</TableCell>
      <TableCell className="hidden md:table-cell">{song.url}</TableCell>
      <TableCell className="hidden lg:table-cell">
        {formatSeconds(song.start)}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {formatSeconds(song.end)}
      </TableCell>
      <TableCell>
        <VoteAction
          voteRequest={song}
          userId={userId}
          canDeleteAll={canDeleteAll}
          votingEnabled={!voted && votingEnabled}
        />
      </TableCell>
    </TableRow>
  );
}

function EmptyVoteRow() {
  return (
    <TableRow>
      <TableCell colSpan={7}>
        <p className="text-center">
          Es gibt keine Vorschläge, reiche einen ein
        </p>
      </TableCell>
    </TableRow>
  );
}

export function VotingTable({
  songRequests: songs,
  vote,
  userId,
  canDeleteAll,
  votingEnabled,
}: {
  songRequests: SongVoteRequest[];
  vote: SongVote | null;
  userId: string;
  canDeleteAll: boolean;
  votingEnabled: boolean;
}) {
  let ShouldDisplayEmptyRow = songs.length == 0;

  return (
    <Table className="overflow-y-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Gewählt</TableHead>
          <TableHead>Titel</TableHead>
          <TableHead className="hidden md:table-cell">Url</TableHead>
          <TableHead className="hidden lg:table-cell">Start</TableHead>
          <TableHead className="hidden lg:table-cell">Ende</TableHead>
          <TableHead className="text-center">Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ShouldDisplayEmptyRow ? (
          <EmptyVoteRow />
        ) : (
          songs.map((song) => (
            <VoteRow
              voteRequest={song}
              userId={userId}
              canDeleteAll={canDeleteAll}
              voted={vote?.songRequestId == song.id}
              votingEnabled={votingEnabled}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}
