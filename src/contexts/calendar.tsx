import type FullCalendar from "@fullcalendar/react";
import { CheckedState } from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { produce } from "immer";
import { createContext, ReactNode, useContext } from "react";
import { RefObject, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // npm install uuid

import { DUMMY_SCHEDULES, DUMMY_TAGS, FREQUENCY, SCHEDULE_VIEW_TYPE } from "@/constants";
import { CustomError } from "@/lib/customError";
import { getMonthDateRange } from "@/lib/date";
import { calculateDateRangeDiff, calculateRepeatEndDate } from "@/lib/utils";

type InputDateType = string | number | Date | dayjs.Dayjs;

interface CalendarControls {
  viewType: CalendarViewType;
  checkedTagIds: string[] | null;
  currentDate: string;
  startDate: string;
  endDate: string;
  clickedDate: string | null;
  calendarTitle: string;
  entireSchedules: EntireSchedule[];
  entireTags: Tag[];
  calendarRef: RefObject<FullCalendar | null>;
  getCalendarSchedules: () => CalendarSchedule[];
  getSummarySchedules: () => SummarySchedule[];
  createSchedule: (schedule: CreatedScheduleArg) => void;
  updateSchedule: (sid: string, schedule: UpdatedScheduleArg) => void;
  modifySchedule: (sid: string, schedule: ModifiedScheduleArg) => void;
  deleteSchedule: (sid: string) => void;
  updateCheckedTagIds: (ids: string[]) => void;
  updateDateObj: (startDate: InputDateType, endDate: InputDateType) => void;
  updateCurrentDate: (currentDate: InputDateType) => void;
  updateClickedDate: (clickedDate: InputDateType) => void;
  moveCalendar: (type: "next" | "prev") => void;
  changeView: (mode: CalendarViewType) => void;
  updateTagChecked: (checked: CheckedState, id: string) => void;
  getTagChecked: (id: string) => boolean;
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
  const [checkedTagIds, setCheckedTagIds] = useState<string[] | null>(null);
  const [calendarTitle, setCalendarTitle] = useState(dayjs().format("YYYY년 MM월")); // 캘린더 헤더에 노출될 날짜형식의 title ex) 2024년 06월, 2024년 06월 30일 ~ 07월 06일
  const [dateObj, setDateObj] = useState<CalendarDateState>(getMonthDateRange(dayjs().toString()));
  const [currentDate, setCurrentDate] = useState(dayjs("2025-01-01").toISOString());
  const { startDate, endDate } = dateObj;
  const [clickedDate, setClickedDate] = useState<string | null>(null);

  const [entireSchedules, setEntireSchedules] = useState<EntireSchedule[]>(DUMMY_SCHEDULES);
  const [entireTags, setEntireTags] = useState<Tag[]>(DUMMY_TAGS);

  const getCalendarSchedules = () => {
    const calendarStartDate = startDate;
    const calendarEndDate = endDate;
    const calendarStartDateDayjs = dayjs(calendarStartDate);
    const calendarEndDateDayjs = dayjs(calendarEndDate);

    const schedules = entireSchedules.filter((schedule) => {
      const { startDate, endDate, repeatEndDate, tags } = schedule;
      calendarEndDateDayjs.isAfter(startDate);
      const tagIds = tags.map(({ id }) => id);

      if (
        calendarEndDateDayjs.isAfter(startDate) &&
        (calendarStartDateDayjs.isBefore(endDate) || calendarStartDateDayjs.isBefore(repeatEndDate)) &&
        tagIds.find((id) => {
          if (checkedTagIds === null) return true;
          else checkedTagIds.includes(id);
        })
      )
        return schedule;
    });

    const finalSchedules: CalendarSchedule[] = schedules.flatMap((sch) => {
      const { id, title, color, startDate, endDate, isRepeat, repeatFrequency, repeatInterval, repeatEndCount } = sch;
      const startDateDayjs = dayjs(startDate);
      const endDateDayjs = dayjs(endDate);

      // 반복 일정 처리
      if (isRepeat && repeatInterval && repeatEndCount && repeatFrequency && repeatEndCount > 0) {
        const repeatSchedules: CalendarSchedule[] = [];
        let startAt = startDateDayjs.toISOString();
        let endAt = endDateDayjs.toISOString();

        // 종료 횟수(repeatEndCount)만큼 일정 반복 조건에 맞는 일정 배열에 저장
        for (let repeatCount = 0; repeatCount <= repeatEndCount; repeatCount++) {
          // 일정 반복 기준에 맞는 일정 시작, 종료 날짜 계산
          startAt = startDateDayjs.add(repeatInterval * repeatCount, FREQUENCY[repeatFrequency]).toISOString();
          endAt = endDateDayjs.add(repeatInterval * repeatCount, FREQUENCY[repeatFrequency]).toISOString();

          if (dayjs(calendarEndDate).isBefore(startAt) || dayjs(calendarStartDate).isAfter(endAt)) continue;

          repeatSchedules.push({ id, title, color, isRepeat, startAt, endAt });
        }
        return repeatSchedules;
      }
      // 일반 일정 처리
      else {
        const startAt = startDateDayjs.toISOString();
        const endAt = endDateDayjs.toISOString();
        return { id, title, color, isRepeat, startAt, endAt };
      }
    });

    return finalSchedules;
  };

  const getSummarySchedules = () => {
    const calendarStartDate = startDate;
    const calendarEndDate = endDate;

    const finalSchedules = entireSchedules.flatMap((sch) => {
      const { id, title, color, startDate, endDate, isRepeat, repeatFrequency, repeatInterval, repeatEndCount, tags } =
        sch;
      const startDateDayjs = dayjs(startDate);
      const endDateDayjs = dayjs(endDate);
      const tagTitles = tags.map((tag) => tag.title);

      if (isRepeat && repeatInterval && repeatEndCount && repeatFrequency && repeatEndCount > 0) {
        const repeatSchedules: SummarySchedule[] = [];

        let startAt = startDateDayjs.toISOString();
        let endAt = endDateDayjs.toISOString();

        // 종료 횟수(repeatEndCount)만큼 일정 반복 조건에 맞는 일정 배열에 저장
        for (let repeatCount = 0; repeatCount <= repeatEndCount + 1; repeatCount++) {
          // 일정 반복 기준에 맞는 일정 시작, 종료 날짜 계산
          startAt = startDateDayjs.add(repeatInterval * repeatCount, FREQUENCY[repeatFrequency]).toISOString();
          endAt = endDateDayjs.add(repeatInterval * repeatCount, FREQUENCY[repeatFrequency]).toISOString();

          if (dayjs(calendarEndDate).isBefore(startAt) || dayjs(calendarStartDate).isAfter(endAt)) continue;

          repeatSchedules.push({ id, title, color, startAt, endAt, tagTitles });
        }
        return repeatSchedules;
      }
      // 일반 일정 처리
      else {
        const startAt = startDateDayjs.toISOString();
        const endAt = endDateDayjs.toISOString();
        const schedule: SummarySchedule = { id, title, color, startAt, endAt, tagTitles };
        return schedule;
      }
    });

    return finalSchedules;
  };

  const createSchedule = (schedule: CreatedScheduleArg) => {
    const { endDate, isRepeat, repeatInterval, repeatEndCount, repeatFrequency } = schedule;

    setEntireSchedules((prev) =>
      produce(prev, (draft) => {
        draft.push({
          id: uuidv4(),
          ...schedule,
          createdAt: dayjs().toISOString(),
          repeatEndDate: isRepeat
            ? calculateRepeatEndDate({ repeatEndCount, repeatFrequency, repeatInterval, endDate })
            : endDate,
        });
      }),
    );
  };

  const updateSchedule = (sid: string, schedule: UpdatedScheduleArg) => {
    setEntireSchedules((prev) =>
      produce(prev, (draft) => {
        const findId = draft.findIndex((sch) => sch.id === sid);
        if (findId < 0) throw new CustomError("Schedule not found", 404);

        const { startAt, endAt, beforeStartAt, beforeEndAt, ...updateRequest } = schedule;
        const { isRepeat, repeatEndCount, repeatFrequency, repeatInterval } = updateRequest;
        const { startDiffMs, endDiffMs } = calculateDateRangeDiff({ startAt, endAt, beforeStartAt, beforeEndAt });

        const changedStartDate = dayjs(draft[findId].startDate).add(startDiffMs, "ms").toISOString();
        const changedEndDate = dayjs(draft[findId].endDate).add(endDiffMs, "ms").toISOString();

        draft[findId] = {
          id: sid,
          ...updateRequest,
          startDate: changedStartDate,
          endDate: changedEndDate,
          repeatEndDate: isRepeat
            ? calculateRepeatEndDate({ repeatEndCount, repeatFrequency, repeatInterval, endDate: changedEndDate })
            : changedEndDate,
          createdAt: prev[findId].createdAt,
        };
      }),
    );
  };

  const modifySchedule = (sid: string, schedule: ModifiedScheduleArg) => {
    setEntireSchedules((prev) =>
      produce(prev, (draft) => {
        const findId = draft.findIndex((sch) => sch.id === sid);
        if (findId < 0) throw new CustomError("Schedule not found", 404);

        const { startAt, endAt, beforeStartAt, beforeEndAt, isRepeat } = schedule;
        const { startDiffMs, endDiffMs } = calculateDateRangeDiff({ startAt, endAt, beforeStartAt, beforeEndAt });

        draft[findId] = {
          ...prev[findId],
          ...(isRepeat
            ? {
                // 변경된 일정이 반복일정의 경우 변경 이전과 이후 날짜(startAt, beforeStartAt)를 비교 후 실제 일정 날짜(db 의 startDate, endDate)를 변경
                // ※ 일정의 startDate, endDate 기준으로 반복 일정을 구성하므로 startDate, endDate 값 변경시 최종적으로 반복일정 전체에 동일한 날짜 변경사항이 적용
                startDate: dayjs(prev[findId].startDate).add(startDiffMs, "ms").toISOString(),
                endDate: dayjs(prev[findId].endDate).add(endDiffMs, "ms").toISOString(),
                repeatEndDate: dayjs(prev[findId].repeatEndDate).add(endDiffMs, "ms").toISOString(),
              }
            : {
                // 반복일정이 아닌 일반 일정은 변경된 내용을 startDate, endDate 에 그대로 적용
                startDate: startAt,
                endDate: endAt,
                repeatEndDate: endAt,
              }),
        };
      }),
    );
  };

  const deleteSchedule = (sid: string) => {
    setEntireSchedules((prev) =>
      produce(prev, (draft) => {
        const findId = draft.findIndex(({ id }) => id === sid);
        draft.splice(findId, 1);
      }),
    );
  };

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
  const updateCheckedTagIds = (ids: string[]) => setCheckedTagIds(ids);
  const updateClickedDate = (clickedDate: InputDateType) => setClickedDate(dayjs(clickedDate).format("YYYY-MM-DD"));

  const updateTagChecked = (checked: CheckedState, id: string) => {
    const checkedTagIdsSet = new Set(checkedTagIds);
    checked ? checkedTagIdsSet.add(id) : checkedTagIdsSet.delete(id);
    updateCheckedTagIds(Array.from(checkedTagIdsSet));
  };

  const getTagChecked = (id: string) => {
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
    entireSchedules,
    entireTags,
    getCalendarSchedules,
    getSummarySchedules,
    createSchedule,
    updateSchedule,
    modifySchedule,
    deleteSchedule,
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
