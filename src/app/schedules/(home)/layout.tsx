"use client";

import FullCalendar from "@fullcalendar/react";
import { useRef } from "react";

import Header from "@/app/components/layout/header";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const calendarRef = useRef<FullCalendar>(null);
  return (
    <div className="absolute flex size-full flex-col overflow-hidden">
      <Header />

      <main className="relative flex-1">{children}</main>
    </div>
  );
}
