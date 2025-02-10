"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import BasicLoader from "@/app/components/basic-loader";
import ErrorBoundary from "@/app/components/error-boundary";
import { Button } from "@/app/components/ui/button";
import { Form } from "@/app/components/ui/form";
import { ChangeConfirm, DeleteConfirm } from "@/app/schedules/[sid]/confirms";
import { FormValues, ScheduleForm, scheduleSchema } from "@/app/schedules/schedule-form";
import apiRequest from "@/lib/api";

export default function ScheduleDetail() {
  const { sid } = useParams<{ sid: string }>();

  const router = useRouter();

  // 개인 일정 상세 정보 조회 api
  const { data, isSuccess } = useQuery({
    throwOnError: true,
    queryKey: ["scheduleDetail", sid],
    queryFn: () => apiRequest("getSchedule", undefined, sid),
  });

  return (
    <div className="absolute left-0 top-0 z-10 flex size-full flex-col bg-white">
      {/* content title */}
      <div className="border-b-muted flex h-12 items-center space-x-1 border border-b-2">
        <Button type="button" variant="image-icon-active" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-lg font-medium">일정 상세 정보</h1>
      </div>

      {/* 일정 상세 정보 Form content */}
      <div className="size-full overflow-y-auto px-6 py-4">
        <ErrorBoundary>
          {isSuccess ? <ScheduleDetailForm scheduleId={Number(sid)} data={data} /> : <BasicLoader />}
        </ErrorBoundary>
      </div>
    </div>
  );
}

const ScheduleDetailForm = ({ scheduleId, data }: { scheduleId: number; data: GetScheduleRes }) => {
  const [confirmOpen, setConfirmOpen] = useState(false); // 일정 수정 확인 모달
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); // 일정 삭제 확인 모달

  const { isRepeat, repeatFrequency, repeatInterval, repeatEndCount, description, ...rest } = data;

  const defaultValues: FormValues = {
    description: description ?? "",
    ...rest,
    ...(isRepeat
      ? { isRepeat: "yes", repeatFrequency, repeatInterval, repeatEndCount }
      : { isRepeat: "no", repeatFrequency: "weekly", repeatInterval: 1, repeatEndCount: 1 }),
  };

  const form = useForm<FormValues>({ resolver: zodResolver(scheduleSchema), defaultValues, mode: "onBlur" });
  const { formState, getValues } = form;
  const { isDirty, isValid } = formState;

  const getIsChangeTags = () => {
    // tag 목록 요소의 개수가 다른 경우 변경됨을 의미하므로 true 반환
    const { tags: defaultTags } = defaultValues;
    const tags = getValues("tags");

    if (defaultTags.length !== tags.length) return true;

    const currentIdsSet = new Set(tags.map((tag) => tag.id));
    // 초기 tag 들의 id 와 현재 form tag 들의 id 목록이 모두 같은 경우 false 반환
    return !defaultTags.every((tag) => currentIdsSet.has(tag.id));
  };

  return (
    <Form {...form}>
      <ScheduleForm onSubmit={() => setConfirmOpen(true)}>
        {/* 푸터 버튼 박스 */}
        <div className="mt-4 flex justify-between ">
          <Button type="button" variant="ghost" onClick={() => setDeleteConfirmOpen(true)}>
            <Trash2 className="mr-2" size={16} />
            일정 삭제
          </Button>
          <Button size="lg" disabled={!(isDirty || getIsChangeTags()) || !isValid}>
            저장
          </Button>
        </div>
      </ScheduleForm>

      <ChangeConfirm
        open={confirmOpen}
        scheduleId={scheduleId}
        defaultValues={defaultValues}
        onOpenChange={(open: boolean) => setConfirmOpen(open)}
      />

      <DeleteConfirm
        open={deleteConfirmOpen}
        scheduleId={scheduleId}
        onOpenChange={(open: boolean) => setDeleteConfirmOpen(open)}
      />
    </Form>
  );
};
