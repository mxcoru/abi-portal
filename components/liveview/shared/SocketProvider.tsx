"use client";

import { Command, CurrentSettings, newCurrentSettings } from "@/lib/command";
import { ReactNode, createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { toast } from "sonner";

export const SocketContext = createContext<Socket | null>(null);
export const SocketSessionContext = createContext<string | null>(null);
export const ControllerCountContext = createContext<number>(0);
export const CurrentSettingsContext = createContext<CurrentSettings>(newCurrentSettings());


export function SocketProvider({ children, socketUrl }: { children: ReactNode, socketUrl: string }) {
    let [socket, setSocket] = useState<Socket | null>(null);
    let [controllerCount, setControllerCount] = useState<number>(0);
    let [timeoutId, setTimeoutId] = useState<number | null>(null);
    let [socketSession, setSocketSession] = useState<string | null>(null);
    let [command, setCommand] = useState<Command | null>(null);
    let [currentSettings, setCurrentSettings] = useState<CurrentSettings>(newCurrentSettings());


    useEffect(() => {
        let socket = io(socketUrl, { autoConnect: true, transports: ["websocket", "webtransport"], reconnection: true });

        socket.on("connect", () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                setTimeoutId(null);
            }

            console.log("connected");

            setSocket(socket);
        })

        socket.on("socketSession.set", (session: string) => {
            setSocketSession(session);
        })

        socket.on("message.toast", (type: "error" | "success" | "info", message: string) => {
            switch (type) {
                case "error":
                    toast.error(message);
                    break;
                case "success":
                    toast.success(message);
                    break;
                case "info":
                    toast.info(message);
                    break;
                default:
                    toast.error(message);
            }
        })



        socket.on("socketSession.clear", () => {
            setSocketSession(null);
        })

        socket.on("controllerCount.set", (count: number) => {
            setControllerCount(count);
        })

        socket.on("command.controller", (newCommand: Command) => {
            if (newCommand?.requestId == command?.requestId) return

            setCommand(newCommand);

            console.log(newCommand);

            switch (newCommand.type) {
                case "playUserSong":
                    setCurrentSettings((currentSettings) => {
                        return {
                            ...currentSettings,
                            currentUserSong: newCommand.data
                        }
                    })
                    break;
                case "playerGroupSong":
                    setCurrentSettings((currentSettings) => {
                        return {
                            ...currentSettings,
                            currentPlayerGroup: {
                                fileId: newCommand.data.fileId,
                                start: newCommand.data.start,
                                end: newCommand.data.end,
                            }
                        }
                    })
                    break;
                case "playerGroupEnd":
                    setCurrentSettings((currentSettings) => {
                        return {
                            ...currentSettings,
                            currentPlayerGroupEnd: {
                                fileId: newCommand.data.fileId,
                                start: newCommand.data.start,
                                end: newCommand.data.end,
                            }
                        }
                    })
                    break;
                case "changePage":
                    setCurrentSettings((currentSettings) => {
                        return {
                            ...currentSettings,
                            currentPage: newCommand.data.page,
                        }
                    })
                    break;
                case "setCurrentTimetableEntry":
                    setCurrentSettings((currentSettings) => {
                        return {
                            ...currentSettings,
                            currentTimetableEntry: newCommand.data.id,
                        }
                    })
                    break;
                default:
                    break;
            }
        })

        socket.on("disconnect", () => {
            setTimeoutId(window.setTimeout(() => {
                setSocketSession(null);
                setSocket(null);
            }, 2000));
        });


        return () => {
            socket.disconnect();
        }
    }, [])



    return (
        <SocketContext.Provider value={socket}>
            <ControllerCountContext.Provider value={controllerCount}>
                <SocketSessionContext.Provider value={socketSession}>
                    <CurrentSettingsContext.Provider value={currentSettings}>
                        {children}
                    </CurrentSettingsContext.Provider>
                </SocketSessionContext.Provider>
            </ControllerCountContext.Provider>
        </SocketContext.Provider >
    );


}