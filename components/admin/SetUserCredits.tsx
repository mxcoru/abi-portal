"use client";
import React from "react";
import { toast } from "sonner";
import { addCredits, setCredits } from "@/app/actions";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function SetUserCredits({
  canSetCredits,
  big,
}: {
  canSetCredits: boolean;
  big?: boolean;
}) {
  return (
    <>
      <SetCreditsDialog canSetCredits={canSetCredits} big={big} />
    </>
  );
}

function SetCreditsDialog({
  canSetCredits,
  big,
}: {
  canSetCredits: boolean;
  big?: boolean;
}) {
  let credits = 0;
  let name = "";

  async function handleClick() {
    let result = await setCredits(name, credits);

    if (!result.success) {
      toast.error(result.error);
    } else {
      window.location.reload();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          disabled={!canSetCredits}
          className={cn("", big && "text-xl h-12")}
        >
          Setze Credits vom Benutzer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Setze dem Benutzer Credits</DialogTitle>
          <DialogDescription>
            Setze den Wert hier ein, um Credits die jeweiligen Credits zu
            setzen.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              type="string"
              onChange={(e) => (name = e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Credits
            </Label>
            <Input
              id="name"
              className="col-span-3"
              type="number"
              defaultValue={0}
              onChange={(e) => (credits = e.target.valueAsNumber)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleClick}>
            Ausführen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
