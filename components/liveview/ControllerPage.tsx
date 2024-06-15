"use client";

import { useEffect, useState } from "react";
import { OTPInput } from "./OTP";
import { useSocket, useSocketSession } from "./hooks";
import { Button } from "../ui/button";

export function ControllerPage({ username }: { username: string }) {
    let [otp, setOTP] = useState<string>("");
    let socketSession = useSocketSession();
    let socket = useSocket();

    function handleLeave() {
        if (!socket) return;

        setOTP("");
        socket.emit("command.leave", { username: username });
    }

    useEffect(() => {
        if (!socket) return;
        if (otp.length < 6) return;
        socket.emit("register.controller", { username: username, otp: otp });

    }, [otp, socket]);

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
                <h1 className="mt-2 text-xl font-semibold">Connected</h1>
                <Button onClick={handleLeave}>Verlassen</Button>
            </div>
        </div>
    )
}