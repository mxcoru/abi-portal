"use client";

import { Button } from "../ui/button";
import { signIn, signOut } from "next-auth/react";

export async function InternalLoginButton({ enabled }: { enabled: boolean }) {
  return (
    <Button
      variant={"outline"}
      className="w-full"
      onClick={() => {
        signIn("authentik");
      }}
      disabled={!enabled}
    >
      Anmelden {enabled ? "" : "(Deaktiviert)"}
    </Button>
  );
}

export async function InternalLogoutButton({ enabled }: { enabled: boolean }) {
  return (
    <Button
      variant={"outline"}
      className="w-full"
      onClick={() => {
        signOut();
      }}
      disabled={!enabled}
    >
      Abmelden {enabled ? "" : "(Deaktiviert)"}
    </Button>
  );
}
