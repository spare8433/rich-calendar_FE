"use client";

import { CheckedState } from "@radix-ui/react-checkbox";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, PanelRightDashed } from "lucide-react";
import { Suspense } from "react";

import BasicLoader from "@/components/basic-loader";
import ErrorBoundary from "@/components/error-boundary";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCalendarContext } from "@/contexts/calendar";
import apiRequest from "@/lib/api";
import { cn } from "@/lib/utils";

const VIEW_BUTTONS_DATA = [
  {
    viewText: "월",
    viewType: "month",
  },
  {
    viewText: "주",
    viewType: "week",
  },
  {
    viewText: "일",
    viewType: "day",
  },
] as const;

interface Props {
  isSideOpen: boolean;
  onClickSideButton: () => void;
}

export default function CalendarHeader({ isSideOpen, onClickSideButton }: Props) {
  const { calendarTitle, viewType, moveCalendar, changeView } = useCalendarContext();

  return (
    <div className="flex justify-between border-b px-4 py-3">
      <div className="flex items-center gap-x-1">
        {/* 캘린더 view 이동 버튼 */}
        <Button variant="outline" size="icon-sm" aria-label="이전으로" onClick={() => moveCalendar("prev")}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="다음으로" onClick={() => moveCalendar("next")}>
          <ChevronRight className="size-4" />
        </Button>

        {/* 필터링을 위한 태그 체크박스 목록 */}
        <Select>
          <SelectTrigger className="w-18 h-9 px-3 text-sm" aria-label="일정 필터 선택">
            <SelectValue placeholder="필터링" />
          </SelectTrigger>
          <SelectContent className="p-2 text-sm">
            <ErrorBoundary>
              <Suspense fallback={<BasicLoader />}>
                <FilterContents />
              </Suspense>
            </ErrorBoundary>
          </SelectContent>
        </Select>

        {/* 캘린더 title */}
        <div className="ml-2 flex items-center font-semibold">{calendarTitle}</div>
      </div>

      <div className="flex items-center gap-x-2">
        {/* view 모드 변경 버튼 목록 */}
        <div className="flex items-center gap-x-1">
          {VIEW_BUTTONS_DATA.map((data) => (
            <Button
              type="button"
              key={data.viewType}
              variant={viewType === data.viewType ? "default" : "secondary"}
              onClick={() => changeView(data.viewType)}
              aria-label={`${data.viewText} 단위 화면으로`}
            >
              {data.viewText}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            className={cn("hidden p-2 lg:inline-block", isSideOpen && "bg-accent")}
            variant="outline-image"
            onClick={onClickSideButton}
          >
            <PanelRightDashed size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}

const FilterContents = () => {
  const { checkedTagIds, startDate, endDate, setCheckedTagIds, getTagChecked, setTagChecked } = useCalendarContext();

  // 필터링용 태그 목록 요청 로직
  const { data: scheduleTagsData } = useSuspenseQuery({
    queryKey: ["schedule_tag", "list", checkedTagIds, startDate, endDate],
    queryFn: () => apiRequest("getScheduleTags"),
  });

  const { tags } = scheduleTagsData;
  const scheduleTagIds = tags.map(({ id }) => id);

  // 초기 태그 데이터 로드시 전체 태그 id 배열을 로컬변수 initialIds 에 저장, 이후 태그를 변경하는 시점부터 정상적으로 state 사용
  // 결과적으로 초기 비동기 데이터요청 후 state 를 저장하는 경우 생기는 불필요한 랜더링(state 값이 useQuery 의 key 이므로 비동기 요청이 중복으로 발생)을 방지
  const initialIds = checkedTagIds === null ? scheduleTagIds : null;

  // 하위 체크박스 체크 핸들링 함수
  function handleCheckedChange(checked: CheckedState, tagId: number) {
    // initialIds 비어있는 경우 즉 checkedTagIds 가 null 인 경우 선택해제된 id 를 제외한 배열을 state 에 저장
    if (initialIds) {
      const entireIdsSet = new Set(initialIds);
      entireIdsSet.delete(tagId);
      setCheckedTagIds(Array.from(entireIdsSet));
    } else {
      setTagChecked(checked, tagId);
    }
  }

  return (
    <ul className="space-y-2">
      {tags.map((tag) => (
        <li className="ml-1 flex items-center space-x-2 text-xs font-medium md:text-sm" key={tag.id}>
          <Checkbox
            id={tag.id.toString()}
            checked={getTagChecked(tag.id)}
            onCheckedChange={(checked) => handleCheckedChange(checked, tag.id)}
          />
          <label htmlFor={tag.id.toString()}>{tag.title}</label>
        </li>
      ))}
    </ul>
  );
};
