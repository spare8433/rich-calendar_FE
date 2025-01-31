import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { CustomError } from "./customError";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type MutationErrorHandlers = Record<number | "default", (error: CustomError) => void>;

export const handleMutationError = (error: unknown, handlers: MutationErrorHandlers) => {
  if (error instanceof CustomError && error.statusCode) {
    (handlers[error.statusCode] || handlers.default)(error);
  }
};
