"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultError, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import ErrorBoundary from "@/app/components/error-boundary";
import { Button, LoadingButton } from "@/app/components/ui/button";
import { Form } from "@/app/components/ui/form";
import { ScheduleForm } from "@/app/schedules/schedule-form";
import { REPEAT_FREQUENCY } from "@/constants";
import { useCalendarContext } from "@/contexts/calendar";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/lib/api";
import { handleMutationError } from "@/lib/utils";

import { ScheduleFormValues, scheduleSchema } from "./schedule-form/form-schema";

interface CreateScheduleVariables {
  req: CreateScheduleReq;
}

export default function ScheduleAdd() {
  const queryClient = useQueryClient();
  const { checkedTagIds, startDate, endDate, clickedDate } = useCalendarContext();
  const router = useRouter();
  const { toast } = useToast();

  // 일정 추가 mutate
  const { mutate, isPending } = useMutation<null, DefaultError, CreateScheduleVariables>({
    mutationFn: ({ req }) => apiRequest("createSchedule", req),
    onSuccess: () => {
      router.back();
      queryClient.fetchQuery({ queryKey: ["calendarSchedules", checkedTagIds, startDate, endDate] });
      toast({ title: "일정 생성이 정상적으로 처리됐습니다.", variant: "success" });
    },
    onError: (error) =>
      handleMutationError(error, {
        400: () => toast({ title: "일정 생성에 실패했습니다 입력하신정보를 다시확인해주세요.", variant: "warning" }),
        default: () =>
          toast({
            title: "일정 생성이 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
            variant: "destructive",
          }),
      }),
  });

  const defaultValues: ScheduleFormValues = {
    title: "",
    color: "pink",
    description: "",
    tags: [],
    importance: "medium",
    startDate: clickedDate ? dayjs(clickedDate).set("hours", 9).toString() : dayjs().toString(),
    endDate: clickedDate ? dayjs(clickedDate).set("hours", 18).toString() : dayjs().add(1, "day").toString(),
    isRepeat: "no",
    repeatInterval: 1,
    repeatFrequency: "weekly",
    repeatEndCount: 1,
  } as const;

  // 상세 정보 form 관리를 위한 useForm
  const form = useForm<ScheduleFormValues>({ resolver: zodResolver(scheduleSchema), mode: "onBlur", defaultValues });

  // form 제출 이벤트 핸들러 변경된 form 내용을 토대로 최종 확인 모달 open
  const onSubmit: SubmitHandler<ScheduleFormValues> = (data) => {
    const { tags, isRepeat, repeatEndCount, repeatFrequency, repeatInterval, startDate, endDate, ...rest } = data;
    mutate({
      req: {
        tagIds: tags.map(({ id }) => id),
        startDate: dayjs(startDate).toISOString(),
        endDate: dayjs(endDate).toISOString(),
        // 유효성 검사에서 isRepeat 이 yes 일 때 반복관련 필드 undefined 여부 확인하므로 undefined 일 수 없으므로 type 고정
        ...(isRepeat === "yes"
          ? {
              isRepeat: true,
              repeatEndCount: repeatEndCount as number,
              repeatFrequency: repeatFrequency as (typeof REPEAT_FREQUENCY)[number],
              repeatInterval: repeatInterval as number,
            }
          : { isRepeat: false, repeatEndCount: null, repeatFrequency: null, repeatInterval: null }),
        ...rest,
      },
    });
  };
  return (
    <div className="absolute left-0 top-0 z-10 flex size-full flex-col overflow-hidden bg-white">
      {/* content title */}
      <div className="border-b-muted flex h-12 items-center space-x-1 border border-b-2">
        <Button type="button" variant="image-icon-active" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-lg font-medium">새 일정 생성</h1>
      </div>

      {/* 개인 일정 추가 Form content */}
      <div className="overflow-y-auto px-6 py-4">
        <Form {...form}>
          <ErrorBoundary>
            <ScheduleForm onSubmit={onSubmit}>
              <LoadingButton
                isLoading={isPending}
                size="lg"
                disabled={!form.formState.isDirty || !form.formState.isValid}
                className="mt-4 self-end"
              >
                완료
              </LoadingButton>
            </ScheduleForm>
          </ErrorBoundary>
        </Form>
      </div>
    </div>
  );
}
