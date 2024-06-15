import { useContext } from "react";
import { ControllerCountContext, SocketContext, SocketSessionContext, CurrentSettingsContext } from "./SocketProvider";

export function useSocket() {
    const socket = useContext(SocketContext);

    if (!socket && socket != null) {
        throw new Error("useSocket must be used within a <SocketProvider>");
    }

    return socket;
}

export function useControllerCount() {
    const controllerCount = useContext(ControllerCountContext);

    if (!controllerCount && controllerCount != 0) {
        throw new Error("useControllerCount must be used within a <SocketProvider>");
    }

    return controllerCount;
}

export function useSocketSession() {
    const socketSession = useContext(SocketSessionContext);

    if (!socketSession && socketSession != null) {
        throw new Error("useSocketSession must be used within a <SocketProvider>");
    }

    return socketSession;
}

export function useCurrentPage() {
    const currentPage = useContext(CurrentSettingsContext);

    if (!currentPage && currentPage != null) {
        throw new Error("useCurrentPage must be used within a <SocketProvider>");
    }

    return currentPage;
}

export function useCurrentUserSong() {
    const currentUserSong = useContext(CurrentSettingsContext);

    if (!currentUserSong && currentUserSong != null) {
        throw new Error("useCurrentUserSong must be used within a <SocketProvider>");
    }

    return currentUserSong;
}

export function useCurrentPlayerGroup() {
    const currentPlayerGroup = useContext(CurrentSettingsContext);

    if (!currentPlayerGroup && currentPlayerGroup != null) {
        throw new Error("useCurrentPlayerGroup must be used within a <SocketProvider>");
    }

    return currentPlayerGroup;
}

export function useCurrentPlayerGroupEnd() {
    const currentPlayerGroupEnd = useContext(CurrentSettingsContext);

    if (!currentPlayerGroupEnd && currentPlayerGroupEnd != null) {
        throw new Error("useCurrentPlayerGroupEnd must be used within a <SocketProvider>");
    }

    return currentPlayerGroupEnd;
}

export function useCurrentTimetableEntry() {
    const currentTimetableEntry = useContext(CurrentSettingsContext);

    if (!currentTimetableEntry && currentTimetableEntry != null) {
        throw new Error("useCurrentTimetableEntry must be used within a <SocketProvider>");
    }

    return currentTimetableEntry;
}