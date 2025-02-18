import type FullCalendar from "@fullcalendar/react";
import { CheckedState } from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { createContext, ReactNode, useContext } from "react";
import { RefObject, useState } from "react";

import { SCHEDULE_VIEW_TYPE } from "@/constants";
import { getMonthDateRange } from "@/lib/date";

dayjs.extend(utc);

type InputDateType = string | number | Date | dayjs.Dayjs;

interface CalendarControls {
  viewType: CalendarViewType;
  checkedTagIds: number[] | null;
  currentDate: string;
  startDate: string;
  endDate: string;
  clickedDate: string | null;
  calendarTitle: string;
  calendarRef: RefObject<FullCalendar | null>;
  updateCheckedTagIds: (ids: number[]) => void;
  updateDateObj: (startDate: InputDateType, endDate: InputDateType) => void;
  updateCurrentDate: (currentDate: InputDateType) => void;
  updateClickedDate: (clickedDate: InputDateType) => void;
  moveCalendar: (type: "next" | "prev") => void;
  changeView: (mode: CalendarViewType) => void;
  updateTagChecked: (checked: CheckedState, id: number) => void;
  getTagChecked: (id: number) => boolean;
}
interface CalendarContextType extends CalendarControls {}

interface CalendarDateState {
  startDate: string;
  endDate: string;
}

interface Props {
  calendarRef: RefObject<FullCalendar | null>;
  children: ReactNode;
}

export const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ calendarRef, children }: Props) {
  const controls = useCalendarControls(calendarRef);
  return <CalendarContext.Provider value={controls}>{children}</CalendarContext.Provider>;
}

// CalendarContext 가 정상적으로 구성되지 않았을 때 예외 처리하는 context 반환하는 커스텀훅
export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useCalendarContext error");

  return context;
};

/**
  캘린더 context 에 상태 및 제어 메서드를 제공하는 커스텀 훅
  @param calendarRef: FullCalendar 컴포넌트의 Ref
 */
export function useCalendarControls(calendarRef: RefObject<FullCalendar | null>): CalendarControls {
  const [viewType, setViewType] = useState<CalendarViewType>("month"); // 현재 캘린더 view 형식
  // 필터에서 체크된 태그 id 목록, 초기값 null 은 초기 모든 태그들이 선택된 상태를 의미하며 이후 체크 상태가 변경되는 경우 체크된 id 배열로 상태를 유지
  const [checkedTagIds, setCheckedTagIds] = useState<number[] | null>(null);
  const [calendarTitle, setCalendarTitle] = useState(dayjs().format("YYYY년 MM월")); // 캘린더 헤더에 노출될 날짜형식의 title ex) 2024년 06월, 2024년 06월 30일 ~ 07월 06일
  const [dateObj, setDateObj] = useState<CalendarDateState>(getMonthDateRange(dayjs().toString()));
  const [currentDate, setCurrentDate] = useState(dayjs().toISOString());
  const { startDate, endDate } = dateObj;
  const [clickedDate, setClickedDate] = useState<string | null>(null);

  const updateCalendarTitle = (dateObj: CalendarDateState & { currentDate: string }, viewType: CalendarViewType) => {
    const { currentDate, startDate, endDate } = dateObj;
    const currentKstDate = dayjs(currentDate);

    // 주어진 view type 에 맞게 각각 calendarTitle 설정 함수 구현
    const viewTypeTitle: Record<string, string> = {
      day: currentKstDate.format("YYYY년 MM월 DD일"),
      week: `${dayjs(startDate).format("YYYY년 MM월 DD일")} ~ ${dayjs(endDate).format("MM월 DD일")}`,
      month: currentKstDate.format("YYYY년 MM월"),
    };

    setCalendarTitle(viewTypeTitle[viewType]);
  };

  const updateDateObj = (startDate: InputDateType, endDate: InputDateType) => {
    setDateObj({
      startDate: dayjs(startDate).toISOString(),
      endDate: dayjs(endDate).toISOString(),
    });
  };
  const updateCurrentDate = (currentDate: InputDateType) => setCurrentDate(dayjs(currentDate).toISOString());
  const updateCheckedTagIds = (ids: number[]) => setCheckedTagIds(ids);
  const updateClickedDate = (clickedDate: InputDateType) => setClickedDate(dayjs(clickedDate).format("YYYY-MM-DD"));

  const updateTagChecked = (checked: CheckedState, id: number) => {
    const checkedTagIdsSet = new Set(checkedTagIds);
    checked ? checkedTagIdsSet.add(id) : checkedTagIdsSet.delete(id);
    updateCheckedTagIds(Array.from(checkedTagIdsSet));
  };

  const getTagChecked = (id: number) => {
    if (checkedTagIds === null) return true; // 초기상태의 경우 true 반환

    const checkedTagIdsSet = new Set(checkedTagIds);
    return checkedTagIdsSet.has(id);
  };

  const moveCalendar = (type: "next" | "prev") => {
    if (!calendarRef.current) return;

    calendarRef.current.getApi()[type === "next" ? "next" : "prev"]();

    const dateProcess = type === "next" ? "add" : "subtract";
    const viewTypeCurrentDate: Record<CalendarViewType, string> = {
      day: dayjs(currentDate)[dateProcess](1, "day").toISOString(),
      week: dayjs(currentDate)[dateProcess](1, "week").startOf("week").toISOString(),
      month: dayjs(currentDate)[dateProcess](1, "month").startOf("month").toISOString(),
    };

    setCurrentDate(viewTypeCurrentDate[viewType]);
    updateCalendarTitle({ currentDate: viewTypeCurrentDate[viewType], startDate, endDate }, viewType);
  };

  const changeView = (viewType: CalendarViewType) => {
    if (!calendarRef.current) return;

    calendarRef.current.getApi().changeView(SCHEDULE_VIEW_TYPE[viewType]); // 캘린더에서 view 변경

    if (viewType === "day") setDateObj({ startDate: currentDate, endDate: currentDate });
    setViewType(viewType); // `viewType` state 변경
  };

  return {
    calendarRef,
    viewType,
    checkedTagIds,
    currentDate,
    startDate,
    endDate,
    clickedDate,
    calendarTitle,
    updateDateObj,
    updateCheckedTagIds,
    updateCurrentDate,
    updateClickedDate,
    moveCalendar,
    changeView,
    updateTagChecked,
    getTagChecked,
  };
}
