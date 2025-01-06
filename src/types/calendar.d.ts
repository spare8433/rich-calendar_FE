type ColorType = "pink" | "blue" | "green" | "yellow" | "purple" | "orange" | "mint" | "lavender" | "beige" | "coral";

type ScheduleImportanceType = "veryLow" | "low" | "medium" | "high" | "veryHigh";

type RepeatFrequencyType = "daily" | "weekly" | "monthly" | "yearly";

type RepeatEndOptionType = "count" | "endDate" | null;

type ModifyOptionType = "only" | "afterAll" | "all";

type DeleteOptionType = ModifyOptionType & {};

interface Tag {
  id: number;
  name: string;
}

interface Schedule {
  id: number;
  title: string;
  color: ColorType;
  dates: {
    startDate: string; // ISO8601
    endDate: string; // ISO8601
  }[];
}

interface SummarySchedule {
  startDate: string; // ISO8601 (YYYY-MM-DD)
  schedules: {
    id: number;
    endDate: string; // ISO8601 (YYYY-MM-DD)
    title: string;
    color: ColorType;
    tagNames: string[];
  }[];
}