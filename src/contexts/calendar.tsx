import type FullCalendar from "@fullcalendar/react";
import { CheckedState } from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext } from "react";
import { RefObject, useState } from "react";

import { SCHEDULE_VIEW_TYPE } from "@/constants";
import { getMonthDateRange, getWeekDateRange } from "@/lib/date";

interface CalendarControls {
  viewType: CalendarViewType;
  checkedTagIds: number[] | null;
  currentDate: string;
  startDate: string;
  endDate: string;
  calendarTitle: string;
  calendarRef: RefObject<FullCalendar | null>;
  setCheckedTagIds: Dispatch<SetStateAction<number[] | null>>;
  moveCalendar: (type: "next" | "prev") => void;
  changeView: (mode: CalendarViewType) => void;
  setTagChecked: (checked: CheckedState, id: number) => void;
  getTagChecked: (id: number) => boolean;
}
interface CalendarContextType extends CalendarControls {}

interface CalendarDateState {
  startDate: string;
  endDate: string;
  currentDate: string;
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

  // 캘린더에서 사용될 객체형식의 날짜 데이터
  const [dateObj, setDateObj] = useState<CalendarDateState>(() => {
    const today = dayjs().format("YYYY-MM-DD");
    return { currentDate: today, ...getMonthDateRange(today) };
  });

  const { currentDate, startDate, endDate } = dateObj;

  const updateCalendarTitle = (dateObj: CalendarDateState, viewType: CalendarViewType) => {
    const { currentDate, startDate, endDate } = dateObj;
    const currentDayjs = dayjs(currentDate);

    // 주어진 view type 에 맞게 각각 calendarTitle 설정 함수 구현
    const viewTypeHandlers: Record<string, () => void> = {
      day: () => setCalendarTitle(currentDayjs.format("YYYY년 MM월 DD일")),
      week: () =>
        setCalendarTitle(`${dayjs(startDate).format("YYYY년 MM월 DD일")} ~ ${dayjs(endDate).format("MM월 DD일")}`),
      month: () => setCalendarTitle(currentDayjs.format("YYYY년 MM월")),
    };

    viewTypeHandlers[viewType]();
  };

  const updateCheckedTagIds = (callback: (set: Set<number>) => void) => {
    const checkedTagIdsSet = new Set(checkedTagIds); // checkedTagIds state 를 Set 으로 변환하여 checkedTagIdsSet 변수에 저장
    callback(checkedTagIdsSet); //checkedTagIdsSet 를 콜백함수의 매개변수로 전달
    setCheckedTagIds(Array.from(checkedTagIdsSet)); // checkedTagIdsSet 을 다시 배열의 형태로 state 업데이트
  };

  const setTagChecked = (checked: CheckedState, id: number) =>
    updateCheckedTagIds((set) => (checked ? set.add(id) : set.delete(id)));

  const getTagChecked = (id: number) => {
    if (checkedTagIds === null) return true; // 초기상태의 경우 true 반환

    const checkedTagIdsSet = new Set(checkedTagIds);
    return checkedTagIdsSet.has(id);
  };

  const moveCalendar = (type: "next" | "prev") => {
    if (!calendarRef.current) return;

    const dateProcess = type === "next" ? "add" : "subtract";
    const viewTypeHandlers: Record<CalendarViewType, () => CalendarDateState> = {
      day: () => {
        const nextDay = dayjs(currentDate)[dateProcess](1, "day").format("YYYY-MM-DD");
        return { currentDate: nextDay, startDate: nextDay, endDate: nextDay };
      },
      week: () => {
        const nextWeek = dayjs(currentDate)[dateProcess](1, "week").startOf("week").format("YYYY-MM-DD");
        return { currentDate: nextWeek, ...getWeekDateRange(nextWeek) };
      },
      month: () => {
        const nextMonth = dayjs(currentDate)[dateProcess](1, "month").startOf("month").format("YYYY-MM-DD");
        return { currentDate: nextMonth, ...getMonthDateRange(nextMonth) };
      },
    };

    const dateObj = viewTypeHandlers[viewType]();
    updateCalendarTitle(dateObj, viewType);
    setDateObj(dateObj);
    calendarRef.current.getApi()[type === "next" ? "next" : "prev"]();
  };

  const changeView = (viewType: CalendarViewType) => {
    if (!calendarRef.current) return;

    calendarRef.current.getApi().changeView(SCHEDULE_VIEW_TYPE[viewType]); // 캘린더에서 view 변경

    const viewTypeHandlers: Record<string, () => CalendarDateState> = {
      day: () => ({ currentDate, startDate: currentDate, endDate: currentDate }),
      week: () => ({ currentDate: currentDate, ...getWeekDateRange(currentDate) }),
      month: () => ({ currentDate, ...getMonthDateRange(currentDate) }),
    };

    setViewType(viewType); // `viewType` state 변경
    setDateObj(viewTypeHandlers[viewType]());
  };

  return {
    calendarRef,
    viewType,
    checkedTagIds,
    currentDate,
    startDate,
    endDate,
    calendarTitle,
    setCheckedTagIds,
    moveCalendar,
    changeView,
    setTagChecked,
    getTagChecked,
  };
}
