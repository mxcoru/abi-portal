"use client";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { deleteAllCredits } from "@/app/admin/actions";
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
import { DollarSign } from "lucide-react";

export function DeleteAllUserCredits({ disabled }: { disabled?: boolean }) {
  async function handleClick() {
    let result = await deleteAllCredits();

    if (!result.success) {
      toast.error(result.error);
    } else {
      window.location.reload();
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={disabled}
          variant={"outline"}
          className="rounded-full text-red-700"
        >
          <DollarSign className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bist du dier sicher?</AlertDialogTitle>
          <AlertDialogDescription>
            Hiermit werden alle Credits vom jedem Benutzer auf 0 gesetzt.
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
