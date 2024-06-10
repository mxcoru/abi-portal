"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { signIn, signOut } from "next-auth/react";

export function InternalLoginButton({
  enabled,
  big,
}: {
  enabled: boolean;
  big?: boolean;
}) {
  return (
    <Button
      variant={"outline"}
      className={cn("w-full", big && "text-xl h-12")}
      onClick={() => {
        signIn("authentik");
      }}
      disabled={!enabled}
    >
      Anmelden {enabled ? "" : "(Deaktiviert)"}
    </Button>
  );
}

export function InternalLogoutButton({
  enabled,
  big,
}: {
  enabled: boolean;
  big?: boolean;
}) {
  return (
    <Button
      variant={"outline"}
      className={cn("w-full", big && "text-xl h-12")}
      onClick={() => {
        signOut();
      }}
      disabled={!enabled}
    >
      Abmelden {enabled ? "" : "(Deaktiviert)"}
    </Button>
  );
}
