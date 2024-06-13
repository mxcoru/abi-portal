import { EndSongVote, EndSongVoteRequest, User } from "@prisma/client";
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
  voteRequest,
  voted,
  userId,
  canDeleteAll,
  votingEnabled,
  canDownload,
  base_url,
}: {
  voteRequest: EndSongVoteRequest & { votes: EndSongVote[]; user: User };
  voted: boolean;
  userId: string;
  canDeleteAll: boolean;
  votingEnabled: boolean;
  canDownload: boolean;
  base_url: string;
}) {
  return (
    <TableRow key={voteRequest.id}>
      {canDeleteAll && (
        <TableCell className="hidden lg:table-cell text-center">
          {voteRequest.user.name}
        </TableCell>
      )}
      <TableCell className="text-center">
        <p>{voteRequest.votes.length}</p>
      </TableCell>
      <TableCell className="text-center w-100  ">
        {voted ? (
          <span className="text-green-500">Ja</span>
        ) : (
          <span className="text-red-500">Nein</span>
        )}
      </TableCell>
      <TableCell>{voteRequest.title}</TableCell>
      <TableCell className="hidden md:table-cell">{voteRequest.url}</TableCell>
      <TableCell className="hidden lg:table-cell">
        {formatSeconds(voteRequest.start)}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {formatSeconds(voteRequest.end)}
      </TableCell>
      <TableCell>
        <VoteAction
          voteRequest={voteRequest}
          userId={userId}
          canDeleteAll={canDeleteAll}
          votingEnabled={!voted && votingEnabled}
          canDownload={canDownload}
          base_url={base_url}
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

export function EndVotingTable({
  songRequests: songs,
  vote,
  userId,
  canDeleteAll,
  votingEnabled,
  canDownload,
  base_url,
}: {
  songRequests: (EndSongVoteRequest & { votes: EndSongVote[]; user: User })[];
  vote: EndSongVote | null;
  userId: string;
  canDeleteAll: boolean;
  votingEnabled: boolean;
  canDownload: boolean;
  base_url: string;
}) {
  let ShouldDisplayEmptyRow = songs.length == 0;

  return (
    <Table className="overflow-y-auto">
      <TableHeader>
        <TableRow>
          {canDeleteAll && (
            <TableHead className="hidden lg:table-cell">Ersteller</TableHead>
          )}
          <TableHead>Stimmen</TableHead>
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
              canDownload={canDownload}
              base_url={base_url}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}
