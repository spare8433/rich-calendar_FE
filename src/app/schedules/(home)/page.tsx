"use client";

import FullCalendar from "@fullcalendar/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";

import ScheduleConfirmModal from "@/app/components/schedule-confirm-modal";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import CalendarHeader from "@/app/schedules/calendar-header";
import useCalendar, { ScheduleExtendedProps, ScheduleInput } from "@/app/schedules/useCalendar";
import { useCalendarContext } from "@/contexts/calendar";
import { useToast } from "@/hooks/use-toast";
import { changeDateIfMidnight } from "@/lib/date";
import { getScheduleColorVariable } from "@/lib/utils";

export default function ScheduleCalendar() {
  const [isSideOpen, setIsSideOpen] = useState(false);

  return (
    <div className="absolute z-0 flex size-full flex-col">
      {/* 캘린더 전체 */}

      {/* 캘린더 조작을 위한 header 부분 */}
      <CalendarHeader isSideOpen={isSideOpen} onClickSideButton={() => setIsSideOpen((prev) => !prev)} />

      <div className="relative flex h-full flex-1">
        <div className="absolute flex size-full">
          {/* calendar */}
          <CalendarContent />

          {isSideOpen && (
            // 사이드 메뉴
            <aside className="flex h-full w-72 flex-col border-l p-4">
              <CalendarSideMenu />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

const CalendarContent = () => {
  const { calendarRef, getCalendarSchedules, modifySchedule } = useCalendarContext();
  const { confirmOpen, calendarOption, scheduleChange, onConfirmOpenChange } = useCalendar(calendarRef);
  const { toast } = useToast();

  const calendarSchedules = getCalendarSchedules();

  const events: ScheduleInput[] = calendarSchedules.map((sch) => {
    const { id, title, startAt, endAt, color, isRepeat } = sch;
    return {
      id: `${id}-${startAt}`,
      title: title,
      classNames: `border-2 pl-1 text-foreground font-bold`,
      // 시간 단위로 설정된 일정은 캘린더에서 editable 이 일부 제한되므로 자정 즉 일단위로 설정된 일정은 시간 단위를 제거하여 사용
      start: changeDateIfMidnight(startAt),
      end: changeDateIfMidnight(endAt),
      backgroundColor: "hsl(var(--schedule-background))",
      borderColor: "hsl(var(--schedule))",
      textColor: "hsl(var(--text-color))",
      editable: true,
      extendedProps: { scheduleId: id, isRepeat, color, startAt, endAt } as ScheduleExtendedProps,
    };
  });

  return (
    <>
      {/* 실제 일정이 노출될 캘린더 content 부분 */}
      <div className="h-full flex-1 p-4 text-sm">
        <FullCalendar events={events} {...calendarOption} />
      </div>

      {/* 일정 수정 확인 모달 */}
      {scheduleChange && (
        <ScheduleConfirmModal
          open={confirmOpen}
          title="일정을 수정하시겠습니까?"
          description="최종확인 후 일정이 수정됩니다."
          onOpenChange={onConfirmOpenChange}
          onAction={() => {
            const { id, ...rest } = scheduleChange;
            modifySchedule(id, rest);
            toast({ title: "일정 수정이 정상적으로 처리됐습니다.", variant: "success" });
            return onConfirmOpenChange(false);
          }}
        />
      )}
    </>
  );
};

const CalendarSideMenu = () => {
  const { getSummarySchedules } = useCalendarContext();

  const summarySchedules = getSummarySchedules();
  const groupedScheduleMap = new Map<string, SummarySchedule[]>();

  summarySchedules.forEach((schedule) => {
    const dateKey = dayjs(schedule.startAt).format("YYYY-MM-DD");
    if (!groupedScheduleMap.has(dateKey)) {
      groupedScheduleMap.set(dateKey, []);
    }
    groupedScheduleMap.get(dateKey)!.push(schedule);
  });

  const sortedSchedules = Array.from(groupedScheduleMap.entries()).sort(([aDate], [bDate]) =>
    dayjs(aDate).diff(dayjs(bDate)),
  );

  return (
    // 월단위 일정 요약 사이드메뉴
    <>
      <h3 className="mb-3 font-bold">일정 목록</h3>
      {/*  해당월의 전체 일정 목록 */}
      <ScrollArea className="h-full flex-1">
        {sortedSchedules.map(([key, schedules]) => (
          <div key={key} className="mb-5">
            <p className="mb-2 text-sm font-medium">{key}</p>
            {schedules.map((schedule) => (
              <Link
                key={schedule.id}
                className="mb-3 block space-y-1 border-l-4 border-[hsl(var(--schedule))] bg-[hsl(var(--schedule-background))] p-2"
                style={getScheduleColorVariable(schedule.color)}
                href={`/schedule/${schedule.id}`}
              >
                <h4 className="text-sm">{schedule.title}</h4>
                <p className="text-muted-foreground flex text-xs">
                  {schedule.tagTitles.length > 0 && `${schedule.tagTitles.join(" · ")}`}
                </p>
              </Link>
            ))}
          </div>
        ))}
      </ScrollArea>
    </>
  );
};
