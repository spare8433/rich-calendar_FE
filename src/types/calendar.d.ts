type ColorType = "pink" | "blue" | "green" | "yellow" | "purple" | "orange" | "mint" | "lavender" | "beige" | "coral";

type ScheduleImportanceType = "very_low" | "low" | "medium" | "high" | "very_high";

type RepeatFrequencyType = "daily" | "weekly" | "monthly" | "yearly";

type RepeatEndOptionType = "count" | "end_date" | null;

type ModifyOptionType = "only" | "after_all" | "all";

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
    start_date: string; // ISO8601
    end_date: string; // ISO8601
  }[];
}

interface SummarySchedule {
  start_date: string; // ISO8601 (YYYY-MM-DD)
  schedules: {
    id: number;
    end_date: string; // ISO8601 (YYYY-MM-DD)
    title: string;
    color: ColorType;
    tag_names: string[];
  }[];
}