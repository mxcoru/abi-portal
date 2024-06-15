export type Command = {
    "type": "playUserSong",
    data: {
        fileId: string,
        start: number,
        end: number
    }
} | {
    type: "changePage",
    data: {
        page: "string"
    }
} | {
    type: "playerGroupSong",
    data: {
        fileId: string,
        start: number,
        end: number
    }
} | {
    type: "playerGroupEnd",
    data: {
        fileId: string,
        start: number,
        end: number
    }
} | {
    type: "setCurrentTimetableEntry",
    data: {
        id: string,
    }
}

export interface CurrentSettings {
    currentTimetableEntry: string | null;
    currentUserSong: {
        fileId: string,
        start: number,
        end: number
    } | null;
    currentPlayerGroup: {
        fileId: string,
        start: number,
        end: number
    } | null;
    currentPlayerGroupEnd: {
        fileId: string,
        start: number,
        end: number
    } | null;
    currentPage: "string" | null;
}

export function newCurrentSettings(): CurrentSettings {
    return {
        currentTimetableEntry: null,
        currentUserSong: null,
        currentPlayerGroup: null,
        currentPlayerGroupEnd: null,
        currentPage: null,
    }
}