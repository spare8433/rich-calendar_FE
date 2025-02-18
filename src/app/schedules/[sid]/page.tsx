"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { isEqual } from "lodash";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import BasicLoader from "@/app/components/basic-loader";
import ErrorBoundary from "@/app/components/error-boundary";
import { Button } from "@/app/components/ui/button";
import { Form } from "@/app/components/ui/form";
import { ScrollArea } from "@/app/components/ui/scroll-area";
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
    <div className="absolute left-0 top-0 z-10 flex size-full flex-col overflow-hidden bg-white">
      {/* content title */}
      <div className="border-b-muted flex h-12 items-center space-x-1 border border-b-2">
        <Button type="button" variant="image-icon-active" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-lg font-medium">일정 상세 정보</h1>
      </div>

      {/* 일정 상세 정보 Form content */}
      <ScrollArea className="overflow-y-auto px-6 py-4">
        <ErrorBoundary>
          {isSuccess ? <ScheduleDetailForm scheduleId={Number(sid)} data={data} /> : <BasicLoader />}
        </ErrorBoundary>
      </ScrollArea>
    </div>
  );
}

const ScheduleDetailForm = ({ scheduleId, data }: { scheduleId: number; data: GetScheduleRes }) => {
  const searchParams = useSearchParams();
  const startAt = searchParams.get("startAt");
  const endAt = searchParams.get("endAt");

  const [confirmOpen, setConfirmOpen] = useState(false); // 일정 수정 확인 모달
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); // 일정 삭제 확인 모달

  const { isRepeat, repeatFrequency, repeatInterval, repeatEndCount, description, startDate, endDate, ...rest } = data;

  const defaultValues: FormValues = {
    description: description ?? "",
    ...rest,
    ...(startAt && endAt ? { startDate: startAt, endDate: endAt } : { startDate, endDate }),
    ...(isRepeat
      ? { isRepeat: "yes", repeatFrequency, repeatInterval, repeatEndCount }
      : { isRepeat: "no", repeatFrequency: "weekly", repeatInterval: 1, repeatEndCount: 1 }),
  };

  const form = useForm<FormValues>({ resolver: zodResolver(scheduleSchema), defaultValues, mode: "onBlur" });
  const { formState, getValues } = form;
  const { isValid } = formState;

  return (
    <Form {...form}>
      <p className="text-muted-foreground mb-6 font-semibold">
        ※ 해당 일정은 반복일정으로 변경된 내용이 개별적으로 적용되지 않고 반복된 일정 전체에 적용됩니다.
      </p>
      <ScheduleForm onSubmit={() => setConfirmOpen(true)}>
        {/* 푸터 버튼 박스 */}
        <div className="mt-4 flex justify-between ">
          <Button type="button" variant="ghost" onClick={() => setDeleteConfirmOpen(true)}>
            <Trash2 className="mr-2" size={16} />
            일정 삭제
          </Button>
          <Button size="lg" disabled={isEqual(defaultValues, getValues()) || !isValid}>
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
