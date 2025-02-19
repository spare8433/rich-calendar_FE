"use client";

import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";

import ScheduleConfirmModal from "@/app/components/schedule-confirm-modal";
import { REPEAT_FREQUENCY } from "@/constants";
import { useCalendarContext } from "@/contexts/calendar";
import { useToast } from "@/hooks/use-toast";

import { FormValues } from "../schedule-form";

interface BasicConfirmProps {
  open: boolean;
  scheduleId: string;
  onOpenChange: (open: boolean) => void;
}

const ChangeConfirm = ({ open, scheduleId, onOpenChange }: BasicConfirmProps) => {
  const searchParams = useSearchParams();
  const startAt = searchParams.get("startAt");
  const endAt = searchParams.get("endAt");
  const { updateSchedule } = useCalendarContext();
  const router = useRouter();
  const { toast } = useToast();

  const { watch } = useFormContext<FormValues>();
  const formValues = watch();

  const onModify = () => {
    const { isRepeat, repeatFrequency, repeatInterval, repeatEndCount, startDate, endDate, ...rest } = formValues;

    updateSchedule(scheduleId, {
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
    });

    onOpenChange(false);
    toast({ title: "일정 수정이 정상적으로 처리됐습니다.", variant: "success" });
    return router.back();
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
      onAction={onModify}
      onOpenChange={onOpenChange}
    />
  );
};

const DeleteConfirm = ({ open, scheduleId, onOpenChange }: BasicConfirmProps) => {
  const { watch } = useFormContext<FormValues>();
  const formValues = watch();
  const router = useRouter();
  const { toast } = useToast();

  const { deleteSchedule } = useCalendarContext();

  const onDelete = () => {
    deleteSchedule(scheduleId);

    onOpenChange(false);
    toast({ title: "일정 수정이 정상적으로 처리됐습니다.", variant: "success" });
    return router.back();
  };

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
      onAction={onDelete}
      onOpenChange={onOpenChange}
    />
  );
};

export { ChangeConfirm, DeleteConfirm };
