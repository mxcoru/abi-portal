"use client";

import { use, useEffect, useState } from "react";
import { OTPInput } from "../shared/OTP";
import { useCurrentUserSong, useSocket, useSocketSession } from "../shared/hooks";
import { Button } from "@/components/ui/button";
import { SelectUserSong, User } from "./UserSong";
import { getUsers } from "@/app/controller/actions";
import { toast } from "sonner";

export function ControllerPage({ username }: { username: string }) {
    let [otp, setOTP] = useState<string>("");
    let [currentUser, setCurrentUser] = useState<User | null>(null);
    let [users, setUsers] = useState<User[]>([]);
    let currentUserSong = useCurrentUserSong();
    let socketSession = useSocketSession();
    let socket = useSocket();

    async function handleSelectUserSong(user: User) {
        console.log(user);

        if (!user || !socket) return;

        setCurrentUser(user);

        toast.success("Gesendet");

        socket.emit("command.controller", {
            type: "playUserSong",
            data: {
                id: user.id,
                name: user.name,
                songs: user.songs.map((song) => ({
                    title: song.title,
                    fileId: song.fileId,
                    start: song.start,
                    end: song.end,
                })),
            }
        });
    }

    function handleLeave() {
        if (!socket) return;

        setOTP("");
        socket.emit("command.leave", { username: username });
    }

    async function handleFetchUsers() {
        if (!socket) return;

        let response = await getUsers();
        if (response.success == false) {
            let newResponse = await getUsers();
            if (newResponse.success == false) {
                toast.error(newResponse.error);
            }

            response = newResponse;
        }
        // @ts-expect-error
        setUsers(response.data ?? []);

    }

    useEffect(() => {
        if (!socket) return;
        if (otp.length < 6) return;
        socket.emit("register.controller", { username: username, otp: otp });

    }, [otp, socket]);

    useEffect(() => {
        if (otp.length < 6) return;
        if (!socketSession || !socket) return;

        handleFetchUsers();

    }, [socketSession, socket])



    useEffect(() => {
        if (users.length == 0 || !socketSession) return;

        if (!currentUserSong) return;

        let user = users.find((user) => user.name == currentUserSong.name);

        if (!user) return;

        setCurrentUser(user);
    }, [currentUserSong, users]);

    if (!socket) {
        return (
            <div className="w-svw h-svh flex flex-row">
                <div className="w-full h-svh flex flex-col justify-center items-center">
                    <h1 className="mt-2 text-xl font-semibold">Bitte Warten</h1>
                </div>
            </div>
        )
    }

    if (!socketSession) {
        return (
            <div className="w-svw h-svh flex flex-row">
                <div className="w-full h-svh flex flex-col justify-center items-center">
                    <OTPInput value={otp} onChange={setOTP} />
                    <h1 className="mt-2 text-xl font-semibold">Bitte geben Sie diesen OTP ein um fortzufahren</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="w-svw h-svh flex flex-row">
            <div className="w-full h-svh flex flex-col justify-center items-center">
                <h1 className="mt-2 text-xl font-semibold">Verbunden mit Viewer ({otp})</h1>
                <SelectUserSong users={users} currentUser={currentUser ?? undefined} handleSelect={handleSelectUserSong} />
                <Button onClick={handleLeave}>Verlassen</Button>
            </div>
        </div>
    )
}