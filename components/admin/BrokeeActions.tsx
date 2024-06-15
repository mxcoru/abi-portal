"use client";
import React from "react";
import { toast } from "sonner";
import { addCredits } from "@/app/admin/actions";
import { DollarSign } from "lucide-react";
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

export function BrokeeAction({
  userId,
  cannAddCredits,
}: {
  userId: string;
  cannAddCredits: boolean;
}) {
  return (
    <>
      <AddCreditsDialog userId={userId} canAddCredits={cannAddCredits} />
    </>
  );
}

function AddCreditsDialog({
  userId,
  canAddCredits,
}: {
  userId: string;
  canAddCredits: boolean;
}) {
  let credits = 0;

  async function handleClick() {
    let result = await addCredits(userId, credits);

    if (!result.success) {
      toast.error(result.error);
    } else {
      window.location.reload();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} disabled={!canAddCredits}>
          Füge Credits hinzu
          <DollarSign className="h-4 w-4 mx-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Füge dem Benutzer Credits hinzu</DialogTitle>
          <DialogDescription>
            Setze den Wert hier ein, um Credits zu hinzufügen.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
