type ColorType = "pink" | "blue" | "green" | "yellow" | "purple" | "orange" | "mint" | "lavender" | "beige" | "coral";

type ScheduleImportanceType = "veryLow" | "low" | "medium" | "high" | "veryHigh";

type RepeatFrequencyType = "daily" | "weekly" | "monthly" | "yearly";

interface Tag {
  id: number;
  title: string;
}

interface BasicCalendarSchedule {
  id: number;
  title: string;
  color: ColorType;
  startDate: string; // ISO8601
  endDate: string; // ISO8601
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

type RepeatCalendarSchedule = BasicCalendarSchedule & RepeatOptions;

type NoRepeatCalendarSchedule = BasicCalendarSchedule & NoRepeatOptions;

type CalendarSchedule = RepeatCalendarSchedule | NoRepeatCalendarSchedule;

interface SummarySchedule {
  id: number;
  startDate: string; // ISO8601 (YYYY-MM-DD)
  endDate: string; // ISO8601 (YYYY-MM-DD)
  title: string;
  color: ColorType;
  tags: string[];
}
