"use client";

import FullCalendar from "@fullcalendar/react";
import { useRef } from "react";

import Header from "@/app/components/layout/header";
import { CalendarProvider } from "@/contexts/calendar";

interface Props {
  children: React.ReactNode;
  detail: React.ReactNode; // 상세정보
  add: React.ReactNode; // 일정 추가
}

export default function Layout({ children, detail, add }: Props) {
  const calendarRef = useRef<FullCalendar>(null);
  return (
    <CalendarProvider calendarRef={calendarRef}>
      {detail}
      {add}
      <div className="absolute flex size-full flex-col overflow-hidden">
        <Header />

        <div className="relative flex flex-1">
          <main className="relative flex-1 ">{children}</main>
        </div>
      </div>
    </CalendarProvider>
  );
}
