"use client";

import { DefaultError, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormContext } from "react-hook-form";

import { FormValues } from "@/components/schedule/schedule-form";
import ScheduleConfirmModal from "@/components/schedule-confirm-modal";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/lib/api";

// confirms 의 공통 mutation callback 옵션 반환
const useMutationCallback = (processName: string, callback: (open: boolean) => void) => {
  const router = useRouter();
  const { toast } = useToast();
  return {
    onSuccess: () => {
      callback(false);
      router.back();
      toast({ title: `${processName}이(가) 정상적으로 처리됐습니다.`, variant: "success" });
    },
    onError: () =>
      toast({
        title: `${processName}이(가) 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.`,
        variant: "destructive",
      }),
  };
};

interface BasicConfirmProps {
  open: boolean;
  scheduleId: number;
  onOpenChange: (open: boolean) => void;
}

interface ChangeConfirmProps extends BasicConfirmProps {
  defaultValues: FormValues;
}

interface ModifyScheduleVariables {
  req: UpdateScheduleReq;
  pathParam: string;
}

const ChangeConfirm = ({ open, scheduleId, defaultValues, onOpenChange }: ChangeConfirmProps) => {
  const mutationCallbacks = useMutationCallback("일정 수정", onOpenChange);
  const { watch } = useFormContext<FormValues>();
  const formValues = watch();

  // 일정 수정 mutation
  const { mutate, isPending } = useMutation<null, DefaultError, ModifyScheduleVariables>({
    mutationFn: ({ req, pathParam }) => apiRequest("updateSchedule", req, pathParam),
    ...mutationCallbacks,
  });

  const onModify = () => {
    const { isRepeat, repeatFrequency, repeatInterval, repeatEndCount, tags, ...rest } = formValues;

    mutate({
      req: {
        tagIds: tags.map(({ id }) => id),
        ...rest,
        ...(isRepeat === "yes"
          ? { isRepeat: true, repeatFrequency, repeatInterval, repeatEndCount }
          : { isRepeat: false, repeatFrequency: null, repeatInterval: null, repeatEndCount: null }),
      },
      pathParam: scheduleId.toString(),
    });
  };

  return (
    <ScheduleConfirmModal
      open={open}
      title="일정을 수정하시겠습니까?"
      description="최종확인 후 일정이 수정됩니다."
      isLoading={isPending}
      onAction={onModify}
      onOpenChange={onOpenChange}
    />
  );
};

interface DeleteConfirmProps extends BasicConfirmProps {
  isRepeat: boolean;
}

interface DeleteScheduleVariables {
  pathParam: string;
}

const DeleteConfirm = ({ open, scheduleId, isRepeat, onOpenChange }: DeleteConfirmProps) => {
  const mutationCallbacks = useMutationCallback("일정 삭제", onOpenChange);

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
      description="최종확인 후 일정이 삭제됩니다."
      isLoading={isPending}
      onAction={onDelete}
      onOpenChange={onOpenChange}
    />
  );
};

export { ChangeConfirm, DeleteConfirm };
