"use client";

import { TimetableEntry } from "@prisma/client";
import { useEffect, useState } from "react";
import { useCurrentTimetableEntry } from "../../shared/hooks";
import { ArrowLeft } from "lucide-react";

export function TimetablePage() {
    let [entries, setEntries] = useState<TimetableEntry[]>([]);
    let currentId = useCurrentTimetableEntry()
    let [entriesToShow, setEntriesToShow] = useState<TimetableEntry[]>([]);
    let [currentEntryStartOnFirstLine, setCurrentEntryStartOnFirstLine] = useState<boolean>(false);

    useEffect(() => {
        if (!entries.length) return;
        let currentIndex = entries.findIndex(e => e.id === currentId);
        if (currentIndex < 0) return;

        if (currentIndex >= 1) {
            setEntriesToShow(entries.slice(currentIndex - 1, currentIndex + 5));
            setCurrentEntryStartOnFirstLine(false);
        } else {
            setEntriesToShow(entries.slice(0, currentIndex + 5));
            setCurrentEntryStartOnFirstLine(true);
        }

    }, [entries, currentId]);

    return (
        <div className="w-svw h-svh flex flex-col">
            <div className="grid grid-cols-6 gap-2 mt-2">
                {entriesToShow.map(e => (
                    <div key={e.id} className="flex flex-col justify-center items-center col-start-2 col-span-5">
                        <div className="text-sm font-bold">{e.name}</div>

                    </div>
                ))}
            </div>
            {currentEntryStartOnFirstLine && (
                <div className="flex flex-col justify-center items-center col-start-1 col-span-1 row-start-1">
                    <ArrowLeft className="text-2xl" />
                </div>
            )}

            {!currentEntryStartOnFirstLine && (
                <div className="flex flex-col justify-center items-center col-start-5 col-span-1 row-start-2">
                    <ArrowLeft className="text-2xl" />
                </div>
            )}
        </div>

    );
}