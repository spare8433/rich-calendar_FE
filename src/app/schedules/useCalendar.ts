"use client";

import {
  CalendarOptions,
  DayCellMountArg,
  EventChangeArg,
  EventClickArg,
  EventInput,
  EventMountArg,
} from "@fullcalendar/core/index.js";
import { EventImpl } from "@fullcalendar/core/internal";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { RefObject, useState } from "react";

import { SCHEDULE_VIEW_TYPE } from "@/constants";
import { useCalendarContext } from "@/contexts/calendar";

export interface ScheduleExtendedProps {
  isRepeat: boolean;
  scheduleId: string;
  color: ColorType;
  startAt: string;
  endAt: string;
}

export interface ScheduleInput extends EventInput {
  extendedProps: ScheduleExtendedProps;
}

export interface ScheduleEvent extends EventImpl {
  extendedProps: ScheduleExtendedProps;
}

export default function useCalendar(calendarRef: RefObject<FullCalendar | null>) {
  const router = useRouter();
  const { currentDate, viewType, updateDateObj, updateClickedDate } = useCalendarContext();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [scheduleChange, setScheduleChange] = useState<ScheduleChangeObject | null>(null);

  const onEventChange = (arg: EventChangeArg) => {
    const { oldEvent, event } = arg;
    const { startStr: beforeStartAt, endStr: beforeEndAt, extendedProps } = oldEvent;
    const { startStr: startAt, endStr: endAt } = event as ScheduleEvent;
    const { scheduleId, isRepeat } = extendedProps;

    setConfirmOpen(true);
    setScheduleChange({
      id: scheduleId,
      isRepeat,
      beforeStartAt: dayjs(beforeStartAt).toISOString(),
      beforeEndAt: dayjs(beforeEndAt).toISOString(),
      startAt: dayjs(startAt).toISOString(),
      endAt: dayjs(endAt).toISOString(),
    });
  };

  const onEventDidMount = (info: EventMountArg) => {
    const color = info.event.extendedProps.color;

    // CSS 변수를 이벤트 DOM 요소에 인라인으로 설정
    info.el.style.setProperty("--schedule-background", `var(--${color}-background)`);
    info.el.style.setProperty("--schedule", `var(--${color})`);
    info.el.style.setProperty("--text-color", `var(--foreground)`);
  };

  const onEventClick = (arg: EventClickArg) => {
    const { extendedProps } = arg.event as ScheduleEvent;
    const { scheduleId, startAt, endAt } = extendedProps;
    router.push(`/schedules/${scheduleId}?startAt=${startAt}&endAt=${endAt}`);
  };

  const onDayCellDidMount = (info: DayCellMountArg) => {
    info.el.style.setProperty("cursor", "pointer");
  };

  const onDateClick = (arg: DateClickArg) => {
    updateClickedDate(arg.date);
    router.push("/schedules/add");
  };

  // Fullcalendar props 객체
  const calendarOption: CalendarOptions & { ref: RefObject<FullCalendar | null> } = {
    // data
    initialDate: currentDate,
    ref: calendarRef,
    // setting & style
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: SCHEDULE_VIEW_TYPE[viewType],
    headerToolbar: false,
    views: {
      timeGridDay: {
        dayHeaderFormat: { month: "numeric", day: "numeric", weekday: "long", omitCommas: true },
      },
    },
    expandRows: true,
    height: "100%",
    eventResizableFromStart: true,
    datesSet: (arg) => {
      updateDateObj(arg.startStr, arg.endStr);
    },
    // 일정 상호작용 관련
    eventChange: onEventChange,
    eventClick: onEventClick,
    eventDidMount: onEventDidMount,
    dayCellDidMount: onDayCellDidMount,
    dateClick: onDateClick,
  };

  return {
    confirmOpen,
    scheduleChange,
    calendarOption,
    onConfirmOpenChange: (open: boolean) => setConfirmOpen(open),
  };
}
