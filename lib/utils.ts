import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mediumDateTimeFormatter = Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Jakarta",
  dateStyle: "full",
  timeStyle: "medium",
  hour12: true,
});

export const shortDateTimeFormatter = Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Jakarta",
  dateStyle: "short",
  timeStyle: "short",
  hour12: true,
});
