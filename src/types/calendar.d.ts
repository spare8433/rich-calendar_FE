type CalendarViewType = "month" | "week" | "day";

type ColorType = "pink" | "blue" | "green" | "yellow" | "purple" | "orange" | "mint" | "lavender" | "beige" | "coral";

type ScheduleImportanceType = "veryLow" | "low" | "medium" | "high" | "veryHigh";

type RepeatFrequencyType = "daily" | "weekly" | "monthly" | "yearly";

interface Tag {
  id: string;
  title: string;
}

interface RepeatOptions {
  isRepeat: true;
  repeatFrequency: RepeatFrequencyType;
  repeatInterval: number;
  repeatEndCount: number;
}

interface NoRepeatOptions {
  isRepeat: false;
  repeatFrequency: null;
  repeatInterval: null;
  repeatEndCount: null;
}

interface ScheduleChangeObject {
  id: string;
  beforeStartAt: string; // ISO8601
  beforeEndAt: string; // ISO8601
  startAt: string; // ISO8601
  endAt: string; // ISO8601
  isRepeat: boolean;
}

interface CalendarSchedule {
  id: string;
  title: string;
  color: ColorType;
  startAt: string; // ISO8601
  endAt: string; // ISO8601
  isRepeat: boolean;
}

interface SummarySchedule {
  id: string;
  startAt: string; // ISO8601 (YYYY-MM-DD)
  endAt: string; // ISO8601 (YYYY-MM-DD)
  title: string;
  color: ColorType;
  tagTitles: string[];
}

interface BasicEntireSchedule {
  id: string;
  title: string;
  description: string;
  importance: ScheduleImportanceType;
  color: ColorType;
  startDate: string; // ISO8601
  endDate: string; // ISO8601
  createdAt: string;
  tags: Tag[];
  repeatEndDate: string;
}

type RepeatEntireSchedule = BasicEntireSchedule & RepeatOptions;

type NoRepeatEntireSchedule = BasicEntireSchedule & NoRepeatOptions;

type EntireSchedule = RepeatEntireSchedule | NoRepeatEntireSchedule;

interface BasicCreatedSchedule {
  title: string;
  description: string;
  importance: ScheduleImportanceType;
  color: ColorType;
  startDate: string; // ISO8601
  endDate: string; // ISO8601
  tags: Tag[];
}

type RepeatCreatedSchedule = BasicCreatedSchedule & RepeatOptions;
type NoRepeatCreatedSchedule = BasicCreatedSchedule & NoRepeatOptions;

type CreatedScheduleArg = RepeatCreatedSchedule | NoRepeatCreatedSchedule;

interface BasicUpdatedSchedule {
  title: string;
  description: string;
  importance: ScheduleImportanceType;
  color: ColorType;
  beforeStartAt: string; // ISO8601
  beforeEndAt: string; // ISO8601
  startAt: string; // ISO8601
  endAt: string; // ISO8601
  tags: Tag[];
}

type RepeatUpdatedSchedule = BasicUpdatedSchedule & RepeatOptions;
type NoRepeatUpdatedSchedule = BasicUpdatedSchedule & NoRepeatOptions;

type UpdatedScheduleArg = RepeatUpdatedSchedule | NoRepeatUpdatedSchedule;

interface ModifiedScheduleArg {
  beforeStartAt: string; // ISO8601
  beforeEndAt: string; // ISO8601
  startAt: string; // ISO8601
  endAt: string; // ISO8601
  isRepeat: boolean;
}
