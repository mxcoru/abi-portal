"use client";

import { useEffect } from "react";
import { OTPInput } from "./OTP";
import { useControllerCount, useSocket, useSocketSession } from "./hooks";

export function ViewerPage({ otp }: { otp: string }) {
    let socket = useSocket();
    let controllerCount = useControllerCount();
    let session = useSocketSession();

    useEffect(() => {
        if (!socket) return;
        if (otp.length < 6) return;
        socket.emit("register.viewer", { otp: otp });

    }, [otp, socket]);

    if (!socket) {
        <div className="w-svw h-svh flex flex-row">
            <div className="w-full h-svh flex flex-col justify-center items-center">
                <h1 className="mt-2 text-xl font-semibold">Bitte Warten</h1>
            </div>
        </div>
    }

    if (!session) {
        return (
            <div className="w-svw h-svh flex flex-row">
                <div className="w-full h-svh flex flex-col justify-center items-center">
                    <OTPInput value={otp} disabled />
                    <h1 className="mt-2 text-xl font-semibold">Bitte geben Sie diesen OTP ein um fortzufahren</h1>
                </div>
            </div>
        );
    }

    if (controllerCount <= 0) {
        return (
            <div className="w-svw h-svh flex flex-row">
                <div className="w-full h-svh flex flex-col justify-center items-center">
                    <OTPInput value={otp} disabled />
                    <h1 className="mt-2 text-xl font-semibold">Warten auf Controller</h1>

                </div>
            </div>
        )
    }

    return (
        <div className="w-svw h-svh flex flex-row">
            <div className="w-full h-svh flex flex-col justify-center items-center">
                Es sind {controllerCount} Controller vorhanden
                <OTPInput value={otp} disabled />
            </div>
        </div>
    )
}   