"use client";

import { createRef, useEffect, useState } from "react";

export function SongPlayer({ fileServerUrl, songs }: { fileServerUrl: string, songs: { title: string, fileId: string, start: number, end: number }[] }) {
    let ref = createRef<HTMLAudioElement>();
    let [setupAutoPlay, setSetupAutoPlay] = useState(false);
    let [currentSongIndex, setCurrentSongIndex] = useState(0);


    useEffect(() => {
        if (!ref.current) return;
        ref.current.focus();
        ref.current.src = `${fileServerUrl}/${songs[currentSongIndex].fileId}.mp3`;
        return () => {
            if (!ref.current) return;

            ref.current.pause();
        }

    }, [currentSongIndex]);

    async function handleOnCanPlay() {
        await ref.current?.play().catch(() => setSetupAutoPlay(true))

    }
    function handleOnEnded() {
        console.log("ended");
        let nextSongIndex = currentSongIndex + 1;
        if (nextSongIndex >= songs.length) {
            nextSongIndex = 0;
        }
        setCurrentSongIndex(nextSongIndex);
    }

    if (setupAutoPlay) {
        return <SetupAutoPlay onFinish={() => setSetupAutoPlay(false)} />
    }

    return (

        <div className="flex flex-col">
            <h1>{songs[currentSongIndex].title}</h1>
            <audio ref={ref} src={`${fileServerUrl}/${songs[currentSongIndex].fileId}.mp3`} onEnded={handleOnEnded} onCanPlay={handleOnCanPlay} loop />
        </div>
    )
}


export function SetupAutoPlay({ onFinish }: { onFinish: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1>Auto Play Setup</h1>
            <p>Sie müssen diesen Song abspielen, um die Auto Play Funktion zu aktivieren.</p>
            <audio src="https://github.com/anars/blank-audio/raw/master/250-milliseconds-of-silence.mp3" onEnded={onFinish} controls></audio>
        </div>
    )

}
