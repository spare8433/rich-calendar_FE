import dayjs from "dayjs";
import { z } from "zod";

import { COLORS, IMPORTANCE, INVALID_TYPE_ERROR, REPEAT_FREQUENCY } from "@/constants";

export const scheduleSchema = z.object({
  title: z
    .string()
    .max(50, { message: "제목은 최대 50자까지 작성가능합니다." })
    .min(2, { message: "제목은 최소 2자 이상 작성해야합니다." }),
  color: z.enum([...COLORS], INVALID_TYPE_ERROR),
  startDate: z.string().refine((startDate) => dayjs(startDate).isValid(), {
    ...INVALID_TYPE_ERROR,
    path: ["startDate"],
  }),
  endDate: z.string().refine((endDate) => dayjs(endDate).isValid(), {
    ...INVALID_TYPE_ERROR,
    path: ["endDate"],
  }),
  description: z
    .string()
    .max(200, { message: "설명은 최대 200자까지 작성가능합니다." })
    .min(2, { message: "설명은 최소 2자 이상 작성해야합니다." }),
  tags: z.array(z.object({ id: z.number(), title: z.string() }, INVALID_TYPE_ERROR)),
  importance: z.enum(IMPORTANCE, INVALID_TYPE_ERROR),
  isRepeat: z.enum(["yes", "no"], INVALID_TYPE_ERROR),
  repeatInterval: z.coerce
    .number(INVALID_TYPE_ERROR)
    .min(1, { message: "반복 횟수 최소값은 1입니다." })
    .max(30, { message: "반복 횟수 최대값은 30입니다." })
    .optional(),
  repeatFrequency: z.enum(REPEAT_FREQUENCY, INVALID_TYPE_ERROR).optional(),
  repeatEndCount: z.coerce
    .number(INVALID_TYPE_ERROR)
    .min(1, { message: "반복 종료 횟수 최소값은 1입니다." })
    .max(30, { message: "반복 종료 횟수 최대값은 30입니다." })
    .optional(),
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;
