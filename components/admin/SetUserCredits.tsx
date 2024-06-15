"use client";
import React from "react";
import { toast } from "sonner";
import { addCredits, setCredits } from "@/app/admin/actions";
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
import { DollarSign } from "lucide-react";

export function SetUserCredits({
  disabled,
}: {
  disabled: boolean;
}) {
  return (
    <>
      <SetCreditsDialog disabled={disabled} />
    </>
  );
}

function SetCreditsDialog({
  disabled,
}: {
  disabled: boolean;
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
          disabled={disabled}
          variant={"outline"}
          className="rounded-full text-green-700"
        >
          <DollarSign className="h-4 w-4" />
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
