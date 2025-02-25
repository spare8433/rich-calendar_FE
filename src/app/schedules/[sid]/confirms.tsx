"use client";

import { DefaultError, useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";

import ScheduleConfirmModal from "@/app/components/schedule-confirm-modal";
import { REPEAT_FREQUENCY } from "@/constants";
import { useCalendarContext } from "@/contexts/calendar";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/lib/api";
import { handleMutationError } from "@/lib/utils";

import { ScheduleFormValues } from "../add/schedule-form/form-schema";

type UseMutationCallbacks = (
  processName: string,
  modalOff: () => void,
) => Pick<UseMutationOptions<null, Error, any, unknown>, "onError" | "onSuccess">;

// confirms 의 공통 mutation modalOff 옵션 반환
const useMutationCallbacks: UseMutationCallbacks = (processName, modalOff) => {
  const queryClient = useQueryClient();
  const { checkedTagIds, startDate, endDate } = useCalendarContext();
  const router = useRouter();
  const { toast } = useToast();
  return {
    onSuccess: () => {
      modalOff();
      toast({ title: `${processName}이(가) 정상적으로 처리됐습니다.`, variant: "success" });
      router.back();
      queryClient.fetchQuery({ queryKey: ["calendarSchedules", checkedTagIds, startDate, endDate] });
    },
    onError: (error) =>
      handleMutationError(error, {
        400: () =>
          toast({ title: `${processName}이(가) 실패했습니다 입력하신정보를 다시확인해주세요.`, variant: "warning" }),
        404: () => {
          toast({ title: "해당 일정이 존재하지 않습니다.", variant: "warning" });
          router.back();
        },
        default: () =>
          toast({
            title: `${processName}이(가) 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.`,
            variant: "destructive",
          }),
      }),
  };
};

interface BasicConfirmProps {
  open: boolean;
  scheduleId: number;
  onOpenChange: (open: boolean) => void;
}
interface ChangeConfirmProps extends BasicConfirmProps {
  defaultValues: ScheduleFormValues;
}
interface ModifyScheduleVariables {
  req: UpdateScheduleReq;
  pathParam: string;
}

const ChangeConfirm = ({ open, scheduleId, defaultValues, onOpenChange }: ChangeConfirmProps) => {
  const searchParams = useSearchParams();
  const startAt = searchParams.get("startAt");
  const endAt = searchParams.get("endAt");

  const { watch } = useFormContext<ScheduleFormValues>();
  const formValues = watch();
  const mutationCallbacks = useMutationCallbacks("일정 수정", () => onOpenChange(false));

  // 일정 수정 mutation
  const { mutate, isPending } = useMutation<null, DefaultError, ModifyScheduleVariables>({
    mutationFn: ({ req, pathParam }) => apiRequest("updateSchedule", req, pathParam),
    ...mutationCallbacks,
  });

  const onModify = () => {
    const { isRepeat, repeatFrequency, repeatInterval, repeatEndCount, tags, startDate, endDate, ...rest } = formValues;

    const request: UpdateScheduleReq = {
      tagIds: tags.map(({ id }) => id),
      ...rest,
      startAt: dayjs(startDate).toISOString(),
      endAt: dayjs(endDate).toISOString(),
      ...(startAt && endAt
        ? { beforeStartAt: startAt, beforeEndAt: endAt }
        : { beforeStartAt: startDate, beforeEndAt: endDate }),
      ...(isRepeat === "yes"
        ? {
            isRepeat: true,
            repeatEndCount: repeatEndCount as number,
            repeatFrequency: repeatFrequency as (typeof REPEAT_FREQUENCY)[number],
            repeatInterval: repeatInterval as number,
          }
        : { isRepeat: false, repeatFrequency: null, repeatInterval: null, repeatEndCount: null }),
    };
    mutate({ req: request, pathParam: scheduleId.toString() });
  };

  return (
    <ScheduleConfirmModal
      open={open}
      title="일정을 수정하시겠습니까?"
      description={
        formValues.isRepeat ? (
          <>
            최종확인 후 일정이 수정되며 <b className="text-foreground">변경 내용은 반복된 일정 전체에 적용</b>됩니다.
          </>
        ) : (
          "최종확인 후 일정이 수정됩니다."
        )
      }
      isLoading={isPending}
      onAction={onModify}
      onOpenChange={onOpenChange}
    />
  );
};

interface DeleteScheduleVariables {
  pathParam: string;
}

const DeleteConfirm = ({ open, scheduleId, onOpenChange }: BasicConfirmProps) => {
  const { watch } = useFormContext<ScheduleFormValues>();
  const formValues = watch();
  const mutationCallbacks = useMutationCallbacks("일정 삭제", () => onOpenChange(false));

  // 일정 삭제 mutation
  const { mutate, isPending } = useMutation<null, DefaultError, DeleteScheduleVariables>({
    mutationFn: ({ pathParam }) => apiRequest("deleteSchedule", undefined, pathParam),
    ...mutationCallbacks,
  });

  const onDelete = () => mutate({ pathParam: scheduleId.toString() });

  return (
    <ScheduleConfirmModal
      open={open}
      title="일정을 삭제하시겠습니까?"
      description={
        formValues.isRepeat ? (
          <>
            최종확인 후 일정이 삭제되며 <b>반복된 일정도 모두 삭제</b>됩니다.
          </>
        ) : (
          "최종확인 후 일정이 삭제됩니다."
        )
      }
      isLoading={isPending}
      onAction={onDelete}
      onOpenChange={onOpenChange}
    />
  );
};

export { ChangeConfirm, DeleteConfirm };
