import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleError(error: unknown) {
  if (error instanceof Error) {
    return { errorMessage: error.message }
  } else if (typeof error === "string") {
    return { errorMessage: error }
  } else {
    return { errorMessage: "An unknown error occurred" }
  }
}