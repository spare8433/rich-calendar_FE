"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultError, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { SendCodeFormValues, sendCodeSchema, VerifyCodeFormValues, verifyCodeSchema } from "@/app/auth/schemas";
import { LoadingButton } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/lib/api";
import { handleMutationError } from "@/lib/utils";

interface VerifyEmailModalProps {
  changeIsOpen: (open: boolean) => void;
  updateEmail: (email: string) => void;
}

export default function VerifyEmailModal({ changeIsOpen, updateEmail }: VerifyEmailModalProps) {
  const { toast } = useToast();
  const [verifyEmailStage, setVerifyEmailStage] = useState<"sendCode" | "verifyCode">("sendCode");

  const sendEmailForm = useForm<SendCodeFormValues>({
    resolver: zodResolver(sendCodeSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const verifyEmailForm = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: "" },
    mode: "onBlur",
  });

  const { email } = sendEmailForm.watch();
  const { code } = verifyEmailForm.watch();

  const sendCodeMutation = useMutation<never, DefaultError, { req: SendEmailCodeReq }>({
    mutationFn: ({ req }) => apiRequest("sendEmailCode", req),
    onSuccess: () => setVerifyEmailStage("verifyCode"),
    onError: (error) =>
      handleMutationError(error, {
        400: () => sendEmailForm.setError("email", { message: "인증 불가능한 이메일입니다." }),
        409: () => sendEmailForm.setError("email", { message: "인증 불가능한 이메일입니다." }),
        429: () =>
          toast({ title: "인증 코드 요청 횟수를 초과했습니다 10분 후 다시 시도해 주세요.", variant: "warning" }),
        default: () =>
          toast({
            title: "인증코드 발송이 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
            variant: "destructive",
          }),
      }),
  });

  const verifyCodeMutation = useMutation<VerifyEmailCodeRes, DefaultError, { req: VerifyEmailCodeReq }>({
    mutationFn: ({ req }) => apiRequest("verifyEmailCode", req),
    onSuccess: ({ success }) => {
      if (success) {
        updateEmail(email); // 인증코드 인증한 이메일을 회원가입 "email" 필드에 등록
        changeIsOpen(false);
      } else {
        toast({ title: "인증코드가 일치하지 않습니다", variant: "warning" });
        verifyEmailForm.setError("code", { message: "올바른 인증코드를 입력해주세요." });
      }
    },
    onError: (error) =>
      handleMutationError(error, {
        400: () => verifyEmailForm.setError("code", { message: "잘못된 인증코드 형식입니다." }),
        409: () => {
          toast({ title: "입력된 이메일이 유효하지 않아 이메일 재인증이 필요합니다.", variant: "warning" });
          setVerifyEmailStage("sendCode");
        },
        default: () =>
          toast({
            title: "인증코드 확인이 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
            variant: "destructive",
          }),
      }),
  });

  const { mutate: sendCodeMutate, isPending: isSendCodePending } = sendCodeMutation;
  const { mutate: verifyCodeMutate, isPending: isVerifyCodePending } = verifyCodeMutation;

  return (
    <Dialog open={true} onOpenChange={changeIsOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        {verifyEmailStage === "sendCode" && (
          <Form {...sendEmailForm}>
            <form onSubmit={sendEmailForm.handleSubmit(() => sendCodeMutate({ req: { email } }))} className="space-y-6">
              <DialogHeader>
                <DialogTitle>이메일을 입력해주세요</DialogTitle>
                <DialogDescription>인증코드를 받을 이메일을 입력해해주세요.</DialogDescription>
              </DialogHeader>
              <FormField
                name="email"
                control={sendEmailForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input placeholder="이메일" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton
                isLoading={isSendCodePending}
                disabled={!sendEmailForm.formState.isValid || !!sendEmailForm.getFieldState("email").error}
                className="w-full"
              >
                인증번호 발송
              </LoadingButton>
            </form>
          </Form>
        )}
        {verifyEmailStage === "verifyCode" && (
          <Form {...verifyEmailForm}>
            <form
              onSubmit={verifyEmailForm.handleSubmit(() => verifyCodeMutate({ req: { email, code } }))}
              className="space-y-6"
            >
              <DialogHeader>
                <DialogTitle>인증 코드 확인</DialogTitle>
                <DialogDescription>이메일로 발송된 인증코드 6자리를 입력해주세요.</DialogDescription>
              </DialogHeader>
              <FormField
                name="code"
                control={verifyEmailForm.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-x-2">
                      <FormControl>
                        <Input placeholder="인증코드 입력" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton
                isLoading={isVerifyCodePending}
                disabled={!verifyEmailForm.formState.isValid || !!verifyEmailForm.getFieldState("code").error}
                className="w-full"
              >
                인증
              </LoadingButton>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
