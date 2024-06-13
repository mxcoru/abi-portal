
import { UserRole } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function IsUserAdmin(user: { role: UserRole }) {
  return user.role == UserRole.ADMIN || user.role == UserRole.SUPER_ADMIN;
}


