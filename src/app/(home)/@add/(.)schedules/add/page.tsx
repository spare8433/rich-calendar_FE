"use client";

import ScheduleAdd from "@/app/components/schedule/add";
import { useCalendarContext } from "@/contexts/calendar";

export default function Page() {
  const { clickedDate } = useCalendarContext();
  return <ScheduleAdd clickedDate={clickedDate ? clickedDate : undefined} />;
}
