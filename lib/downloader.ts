import axios from "axios";

export type ManyVideoDownloadRequest = VideoDownloadRequest[];
export type ManyVideoDownloadResponse = VideoDownloadResponse[];

export interface VideoDownloadRequest {
    url: string;
    start: number;
    end: number;
}

export interface VideoDownloadResponse {
    file_id: string;
    url: string;
}


export async function SendDownloadRequest(data: ManyVideoDownloadRequest): Promise<ManyVideoDownloadResponse | null> {
    let request = await axios.get(process.env.DOWNLOADER_URL as string, {
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(data)
    })

    if (request.status != 200) {
        return null
    }


    return request.data as ManyVideoDownloadResponse;
}

export async function SendDeleteRequest(file_id: string) {

    let request = await axios.post(process.env.DOWNLOADER_URL as string, JSON.stringify({ file_id: file_id }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })


    if (request.status != 204) {
        return
    }
}
