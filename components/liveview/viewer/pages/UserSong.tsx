"use client";

import { useCurrentUserSong } from "../../shared/hooks";
import { SongPlayer } from "../components/SongPlayer";

export function UserSongPage({ fileServerUrl }: { fileServerUrl: string }) {
    let currentUserSong = useCurrentUserSong();

    if (!currentUserSong) return <div></div>;

    return (
        <SongPlayer fileServerUrl={fileServerUrl} songs={currentUserSong.songs} />
    )
}