import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

import { FREQUENCY } from "@/constants";

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

interface ScheduleColorVariable extends CSSProperties {
  "--schedule-background": string;
  "--schedule": string;
}

export const getScheduleColorVariable: (color: ColorType) => ScheduleColorVariable = (color) => {
  return {
    "--schedule-background": `var(--${color}-background)`,
    "--schedule": `var(--${color})`,
  };
};

interface RepeatParam {
  endDate: string;
  repeatInterval: number;
  repeatEndCount: number;
  repeatFrequency: RepeatFrequencyType;
}

export const calculateRepeatEndDate = (repeatParam: RepeatParam) => {
  const { endDate, repeatInterval, repeatEndCount, repeatFrequency } = repeatParam;
  return dayjs(endDate)
    .add(repeatInterval * repeatEndCount, FREQUENCY[repeatFrequency])
    .toISOString();
};

interface DateRangeParam {
  beforeStartAt: string;
  beforeEndAt: string;
  startAt: string;
  endAt: string;
}

export const calculateDateRangeDiff = (dateRangeParam: DateRangeParam) => {
  const { startAt, endAt, beforeStartAt, beforeEndAt } = dateRangeParam;
  const startDiffMs = dayjs(startAt).diff(dayjs(beforeStartAt));
  const endDiffMs = dayjs(endAt).diff(dayjs(beforeEndAt));

  return { startDiffMs, endDiffMs };
};
