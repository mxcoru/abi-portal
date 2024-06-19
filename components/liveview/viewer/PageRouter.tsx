"use client";

import { UserSongPage } from "./pages/UserSong";

export function PageRouter({ fileServerUrl }: { fileServerUrl: string }) {


    return (
        <div className="w-svw h-svh flex flex-row">
            <div className="w-full h-svh flex flex-col justify-center items-center">
                <UserSongPage fileServerUrl={fileServerUrl} />
            </div>
        </div>
    )
}