"use client";

import FullCalendar from "@fullcalendar/react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { DefaultError, useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { Suspense, useRef, useState } from "react";

import BasicLoader from "@/components/basic-loader";
import ErrorBoundary from "@/components/error-boundary";
import CalendarHeader from "@/components/schedule/calendar-header";
import useCalendar, { ScheduleExtendedProps, ScheduleInput } from "@/components/schedule/useCalendar";
import ScheduleConfirmModal from "@/components/schedule-confirm-modal";
import { CalendarProvider, useCalendarContext } from "@/contexts/calendar";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/lib/api";
import { changeDateIfMidnight } from "@/lib/date";
import { getScheduleColorVariable } from "@/lib/utils";

interface ModifyCalendarScheduleVariables {
  req: ModifyCalendarScheduleReq;
  pathParam: string;
}

export default function ScheduleCalendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [isSideOpen, setIsSideOpen] = useState(false);

  return (
    <CalendarProvider calendarRef={calendarRef}>
      <div className="relative z-0 flex size-full flex-1">
        {/* 캘린더 전체 */}
        <div className="absolute flex size-full flex-col ">
          {/* 캘린더 조작을 위한 header 부분 */}
          <CalendarHeader isSideOpen={isSideOpen} onClickSideButton={() => setIsSideOpen((prev) => !prev)} />

          <div className="flex flex-1">
            {/* calendar */}
            <CalendarContent />
            {/* <ErrorBoundary>
              <Suspense fallback={<BasicLoader />}>
                <CalendarContent />
              </Suspense>
            </ErrorBoundary> */}

            {isSideOpen && (
              // 사이드 메뉴
              <aside className="border-box hidden h-full w-72 border-l p-4 lg:inline-block">
                <ErrorBoundary>
                  <Suspense fallback={<BasicLoader />}>
                    <CalendarSideMenu />
                  </Suspense>
                </ErrorBoundary>
              </aside>
            )}
          </div>
        </div>
      </div>
    </CalendarProvider>
  );
}

// const Wrap = () => {
//   const { checkedTagIds, startDate, endDate } = useCalendarContext();

//   // 캘린더에 사용할 일정 목록 요청 로직
//   const { data } = useQuery({
//     queryKey: ["calendarSchedules", checkedTagIds, startDate, endDate],
//     queryFn: () =>
//       apiRequest("getCalendarSchedules", {
//         startDate,
//         endDate,
//         ...(checkedTagIds && { tagIds: checkedTagIds }),
//       }),
//   });

//   return data ? <CalendarContent schedules={data.schedules} /> : <BasicLoader />;
// };

const CalendarContent = () => {
  const { checkedTagIds, startDate, endDate, calendarRef } = useCalendarContext();
  const { confirmOpen, calendarOption, scheduleChange, onConfirmOpenChange } = useCalendar(calendarRef);

  const { data } = useQuery({
    queryKey: ["calendarSchedules", checkedTagIds, startDate, endDate],
    queryFn: () =>
      apiRequest("getCalendarSchedules", {
        startDate,
        endDate,
        ...(checkedTagIds && { tagIds: checkedTagIds }),
      }),
  });

  if (!data) return <BasicLoader />;

  const events: ScheduleInput[] = data.schedules.map((sch) => {
    const { id, startAt, endAt, color, isRepeat } = sch;
    return {
      id: `${id}-${startAt}`,
      title: sch.title,
      classNames: `font-medium`,
      // 시간 단위로 설정된 일정은 캘린더에서 editable 이 일부 제한되므로 자정 즉 일단위로 설정된 일정은 시간 단위를 제거하여 사용
      start: changeDateIfMidnight(startAt),
      end: changeDateIfMidnight(endAt),
      backgroundColor: `hsl(var(--schedule))`,
      borderColor: `hsl(var(--schedule))`,
      editable: true,
      extendedProps: {
        scheduleId: id,
        isRepeat,
        color,
      } as ScheduleExtendedProps,
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
        <ChangeConfirmModal open={confirmOpen} onOpenChange={onConfirmOpenChange} scheduleChange={scheduleChange} />
      )}
    </>
  );
};

interface ChangeConfirmModalProps {
  open: boolean;
  scheduleChange: ScheduleChangeObject;
  onOpenChange: (open: boolean) => void;
}

const ChangeConfirmModal = ({ open, scheduleChange, onOpenChange }: ChangeConfirmModalProps) => {
  const { toast } = useToast();

  const { id, ...rest } = scheduleChange;

  const mutationCallbacks = {
    onSuccess: () => {
      onOpenChange(false);
      toast({ title: "일정 수정이 정상적으로 처리됐습니다.", variant: "success" });
    },
    onError: () =>
      toast({
        title: "일정 수정이 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
        variant: "destructive",
      }),
  };

  // 일정 수정 mutate
  const { mutate, isPending } = useMutation<null, DefaultError, ModifyCalendarScheduleVariables>({
    mutationFn: ({ req, pathParam }) => apiRequest("modifyCalendarSchedule", req, pathParam),
    ...mutationCallbacks,
  });

  // 일정 수정 최종 확인 이벤트 핸들러
  const onConfirm = () => mutate({ req: rest, pathParam: id.toString() });

  return (
    <ScheduleConfirmModal
      open={open}
      isLoading={isPending}
      title="일정을 수정하시겠습니까?"
      description="최종확인 후 일정이 수정됩니다."
      onOpenChange={onOpenChange}
      onAction={onConfirm}
    />
  );
};

const CalendarSideMenu = () => {
  const { checkedTagIds, currentDate, startDate, endDate } = useCalendarContext();

  const { data } = useSuspenseQuery({
    queryKey: ["summary schedule", checkedTagIds, currentDate],
    queryFn: () =>
      apiRequest("getSummarySchedules", {
        startDate,
        endDate,
        ...(checkedTagIds && { tag_ids: checkedTagIds }),
      }),
  });

  const groupedScheduleMap = new Map<string, SummarySchedule[]>();

  data.schedules.forEach((schedule) => {
    const dateKey = dayjs(schedule.startAt).format("YYYY-MM-DD");
    if (!groupedScheduleMap.has(dateKey)) {
      groupedScheduleMap.set(dateKey, []);
    }
    groupedScheduleMap.get(dateKey)!.push(schedule);
  });

  return (
    // 월단위 일정 요약 사이드메뉴
    <>
      <h3 className="mb-2 font-semibold">일정 목록</h3>
      {/*  해당월의 전체 일정 목록 */}
      {Array.from(groupedScheduleMap.entries()).map(([key, schedules]) => (
        <div key={key}>
          <p className="mb-2 text-sm">{key}</p>
          {schedules.map((schedule) => (
            <Link
              key={schedule.id}
              className="mb-2 block space-y-1 border-l-4 border-[hsl(var(--schedule))] bg-[hsl(var(--schedule-background))] p-2"
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
    </>
  );
};
