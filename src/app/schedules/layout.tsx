"use client";

import FullCalendar from "@fullcalendar/react";
import { useRef } from "react";

import { CalendarProvider } from "@/contexts/calendar";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const calendarRef = useRef<FullCalendar>(null);
  return <CalendarProvider calendarRef={calendarRef}>{children}</CalendarProvider>;
}
