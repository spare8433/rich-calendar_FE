"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultError, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm, useFormContext, UseFormHandleSubmit } from "react-hook-form";
import { z } from "zod";

import { SEND_CODE_SCHEMA, SendCodeFormValues, VERIFY_CODE_SCHEMA, VerifyCodeFormValues } from "@/app/auth/schemas";
import { LoadingButton } from "@/app/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/lib/api";
import { handleMutationError } from "@/lib/utils";

const RESET_PASSWORD_SCHEMA = z
  .object({
    password: z
      .string()
      .min(9, "비밀번호는 최소 9자 이상이어야 합니다.")
      .max(64, "비밀번호는 최대 64자 이하이어야 합니다.")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/,
        "비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type ResetPwFormValues = z.infer<typeof RESET_PASSWORD_SCHEMA>;

interface SendPwCodeVariables {
  req: SendPwCodeReq;
}
interface VerifyPwCodeVariables {
  req: VerifyPwCodeReq;
}
interface ResetPwVariables {
  req: ResetPwReq;
}

export default function FindPw() {
  const { toast } = useToast();
  const router = useRouter();
  const [findPwStage, setFindPwStage] = useState<"sendCode" | "verifyCode" | "resetPw">("sendCode");

  const sendEmailForm = useForm<SendCodeFormValues>({
    resolver: zodResolver(SEND_CODE_SCHEMA),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const verifyEmailForm = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(VERIFY_CODE_SCHEMA),
    defaultValues: { code: "" },
    mode: "onBlur",
  });

  const resetPwForm = useForm<ResetPwFormValues>({
    resolver: zodResolver(RESET_PASSWORD_SCHEMA),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const { email } = sendEmailForm.watch();

  const sendCodeMutation = useMutation<never, DefaultError, SendPwCodeVariables>({
    mutationFn: ({ req }) => apiRequest("sendPwCode", req),
    onSuccess: () => setFindPwStage("verifyCode"),
    onError: (error) =>
      handleMutationError(error, {
        400: () => sendEmailForm.setError("email", { message: "인증 불가능한 이메일입니다." }),
        404: () => sendEmailForm.setError("email", { message: "인증 불가능한 이메일입니다." }),
        429: () =>
          toast({ title: "인증 코드 요청 횟수를 초과했습니다 10분 후 다시 시도해 주세요.", variant: "warning" }),
        default: () =>
          toast({
            title: "인증코드 발송이 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
            variant: "destructive",
          }),
      }),
  });

  const verifyCodeMutation = useMutation<VerifyPwCodeRes, DefaultError, VerifyPwCodeVariables>({
    mutationFn: ({ req }) => apiRequest("verifyPwCode", req),
    onSuccess: ({ success }) => {
      if (success) {
        setFindPwStage("resetPw");
      } else {
        toast({ title: "인증코드가 일치하지 않습니다", variant: "warning" });
        verifyEmailForm.setError("code", { message: "올바른 인증코드를 입력해주세요." });
      }
    },
    onError: (error) =>
      handleMutationError(error, {
        400: () => verifyEmailForm.setError("code", { message: "잘못된 인증코드 형식입니다." }),
        404: () => {
          toast({ title: "입력된 이메일이 유효하지 않아 이메일 재인증이 필요합니다.", variant: "warning" });
          setFindPwStage("sendCode");
        },
        default: () =>
          toast({
            title: "인증코드 확인이 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
            variant: "destructive",
          }),
      }),
  });

  const resetPwMutation = useMutation<null, DefaultError, ResetPwVariables>({
    mutationFn: ({ req }) => apiRequest("resetPw", req),
    onSuccess: () => router.push("/auth/login"),
    onError: (error) =>
      handleMutationError(error, {
        400: () =>
          toast({ title: "비밀번호 재설정에 실패했습니다 입력하신정보를 다시확인해주세요.", variant: "warning" }),
        404: () => {
          toast({ title: "입력된 이메일이 유효하지 않아 이메일 재인증이 필요합니다.", variant: "warning" });
          setFindPwStage("sendCode");
        },
        default: () =>
          toast({
            title: "비밀번호 재설정이 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
            variant: "destructive",
          }),
      }),
  });

  return (
    <>
      {/* 이메일 확인 및 인증 코드 발송 단계 (첫번째 단계) */}
      {findPwStage === "sendCode" && (
        <Form {...sendEmailForm}>
          <SendCodeForm
            isLoading={sendCodeMutation.isPending}
            handleSubmit={sendEmailForm.handleSubmit(({ email }) => sendCodeMutation.mutate({ req: { email } }))}
          />
        </Form>
      )}

      {/* 인증코드 발송 후 인증 단계 (두번째 단계) */}
      {findPwStage === "verifyCode" && (
        <Form {...verifyEmailForm}>
          <VerifyCodeForm
            isLoading={verifyCodeMutation.isPending}
            handleSubmit={verifyEmailForm.handleSubmit(({ code }) =>
              verifyCodeMutation.mutate({ req: { email, code } }),
            )}
          />
        </Form>
      )}

      {/* 비밀번호 재설정 (세번째 단계) */}
      {findPwStage === "resetPw" && (
        <Form {...resetPwForm}>
          <ResetPwForm
            isLoading={resetPwMutation.isPending}
            handleSubmit={resetPwForm.handleSubmit(({ password }) =>
              resetPwMutation.mutate({ req: { email, password } }),
            )}
          />
        </Form>
      )}
    </>
  );
}

type FormProps<T extends FieldValues> = { handleSubmit: ReturnType<UseFormHandleSubmit<T>>; isLoading: boolean };

const SendCodeForm = ({ handleSubmit, isLoading }: FormProps<SendCodeFormValues>) => {
  const { control, formState, getFieldState } = useFormContext<SendCodeFormValues>();
  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      <h2 className="text-lg font-medium">이메일을 입력해주세요</h2>
      <p>인증코드를 받을 이메일을 입력해해주세요.</p>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <FormField
          name="email"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="이메일" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          disabled={!formState.isValid || !!getFieldState("email").error}
          isLoading={isLoading}
          className="w-full"
        >
          인증번호 발송
        </LoadingButton>
      </form>
    </div>
  );
};

const VerifyCodeForm = ({ handleSubmit, isLoading }: FormProps<VerifyCodeFormValues>) => {
  const { control, formState, getFieldState } = useFormContext<VerifyCodeFormValues>();
  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      <h2 className="text-lg font-medium">인증 코드 확인</h2>
      <p>이메일로 발송된 인증코드 6자리를 입력해주세요.</p>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <FormField
          name="code"
          control={control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-x-2">
                <FormControl>
                  <Input placeholder="인증코드 입력" maxLength={6} {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          disabled={!formState.isValid || !!getFieldState("code").error}
          isLoading={isLoading}
          className="w-full"
        >
          인증
        </LoadingButton>
      </form>
    </div>
  );
};

const ResetPwForm = ({ handleSubmit, isLoading }: FormProps<ResetPwFormValues>) => {
  const { control, formState, getFieldState } = useFormContext<ResetPwFormValues>();
  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      <h2 className="text-lg font-medium">비밀번호 재설정</h2>
      <p>새로운 비밀번호 입력해 비밀번호를 변경해주세요.</p>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <FormField
          name="password"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>새 비밀번호</FormLabel>
              <FormControl>
                <Input type="password" placeholder="비밀번호" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>새 비밀번호 확인</FormLabel>
              <FormControl>
                <Input type="password" placeholder="비밀번호 확인" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          disabled={!formState.isValid || !!getFieldState("password").error || !!getFieldState("confirmPassword").error}
          isLoading={isLoading}
          className="w-full"
        >
          비밀번호 변경
        </LoadingButton>
      </form>
    </div>
  );
};
