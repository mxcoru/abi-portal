"use client";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { downloadAllRequestedSongs } from "@/app/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export function DownloadAllSongs({ big }: { big?: boolean }) {
    async function handleClick() {
        let result = await downloadAllRequestedSongs();

        if (!result.success) {
            toast.error(result.error);
        } else {
            window.location.reload();
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={"secondary"} className={cn("", big && "text-xl h-12")}>
                    Lade alle Songs herunter
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bist du dier sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Hiermit werden maximal 10 Songs heruntergeladen.

                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClick}>Ausführen</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
