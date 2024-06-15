
import { UserRole } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DatabaseClient } from "./database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function IsUserAdmin(user: { role: UserRole }) {
  return user.role == UserRole.ADMIN || user.role == UserRole.SUPER_ADMIN;
}
export async function decreaseUserCredits(id: string): Promise<boolean> {

  let user = await DatabaseClient.user.findFirst({
    where: { id: id },
    include: { songs: true },
  });

  if (!user) {
    return false;
  }

  if (user.credits === 0) {
    return false;
  }

  await DatabaseClient.user.update({
    where: { id: id },
    data: { credits: user.credits - 1 },
  });

  return true;
}


