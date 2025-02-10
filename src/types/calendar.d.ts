type CalendarViewType = "month" | "week" | "day";

type ColorType = "pink" | "blue" | "green" | "yellow" | "purple" | "orange" | "mint" | "lavender" | "beige" | "coral";

type ScheduleImportanceType = "veryLow" | "low" | "medium" | "high" | "veryHigh";

type RepeatFrequencyType = "daily" | "weekly" | "monthly" | "yearly";

interface Tag {
  id: number;
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
}

// interface ScheduleChangeObject {
//   id: number;
//   initialIsRepeat: boolean;
//   initialStartDate: string; // ISO8601
//   initialEndDate: string; // ISO8601

//   title?: string;
//   description?: string;
//   importance?: ScheduleImportanceType;
//   color?: ColorType;
//   tags?: tag[];
//   startAt?: string; // ISO8601
//   endAt?: string; // ISO8601
//   isRepeat?: boolean;
//   repeatFrequency?: RepeatFrequencyType;
//   repeatInterval?: number;
//   repeatCount?: number;
// }

interface ScheduleChangeObject {
  id: number;
  beforeStartAt: string; // ISO8601
  beforeEndAt: string; // ISO8601
  startAt: string; // ISO8601
  endAt: string; // ISO8601
  isRepeat: boolean;
}

// interface BasicCalendarSchedule {
//   id: number;
//   title: string;
//   color: ColorType;
//   startDate: string; // ISO8601
//   endDate: string; // ISO8601
// }

// type RepeatCalendarSchedule = BasicCalendarSchedule & RepeatOptions;

// type NoRepeatCalendarSchedule = BasicCalendarSchedule & NoRepeatOptions;

// type CalendarSchedule = RepeatCalendarSchedule | NoRepeatCalendarSchedule;

interface CalendarSchedule {
  id: number;
  title: string;
  color: ColorType;
  startAt: string; // ISO8601
  endAt: string; // ISO8601
  isRepeat: boolean;
}

interface SummarySchedule {
  id: number;
  startAt: string; // ISO8601 (YYYY-MM-DD)
  endAt: string; // ISO8601 (YYYY-MM-DD)
  title: string;
  color: ColorType;
  tagTitles: string[];
}
