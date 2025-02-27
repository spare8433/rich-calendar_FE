"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm, useFormContext, UseFormHandleSubmit } from "react-hook-form";
import { z } from "zod";

import { SendCodeFormValues, sendCodeSchema, VerifyCodeFormValues, verifyCodeSchema } from "@/app/auth/schemas";
import { Button } from "@/app/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { ToastAction } from "@/app/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import generateCode from "@/lib/utils";

const resetPasswordSchema = z
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

type ResetPwFormValues = z.infer<typeof resetPasswordSchema>;

export default function FindPw() {
  const { toast } = useToast();
  const router = useRouter();
  const [findPwStage, setFindPwStage] = useState<"sendCode" | "verifyCode" | "resetPw">("sendCode");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const sendEmailForm = useForm<SendCodeFormValues>({
    resolver: zodResolver(sendCodeSchema),
    defaultValues: { email: "yourWatchDemo@rich.calendar" },
    mode: "onChange",
  });

  const verifyEmailForm = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: "" },
    mode: "onBlur",
  });

  const resetPwForm = useForm<ResetPwFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "thisIsNotRealPassword1!", confirmPassword: "thisIsNotRealPassword1!" },
    mode: "onBlur",
  });

  const { code } = verifyEmailForm.watch();

  const sendCode = () => {
    const newCode = generateCode();
    toast({
      title: `코드 발급 : ${newCode}`,
      duration: 10000,
      action: (
        <ToastAction altText="clip code" onClick={async () => await navigator.clipboard.writeText(newCode)}>
          복사
        </ToastAction>
      ),
    });
    setGeneratedCode(newCode);
    setFindPwStage("verifyCode");
  };

  const verifyCode = () => {
    if (generatedCode !== code) {
      toast({ title: "인증코드가 일치하지 않습니다", variant: "warning" });
      return verifyEmailForm.setError("code", { message: "올바른 인증코드를 입력해주세요." });
    }

    setFindPwStage("resetPw");
  };

  return (
    <>
      {/* 이메일 확인 및 인증 코드 발송 단계 (첫번째 단계) */}
      {findPwStage === "sendCode" && (
        <Form {...sendEmailForm}>
          <SendCodeForm handleSubmit={sendEmailForm.handleSubmit(sendCode)} />
        </Form>
      )}

      {/* 인증코드 발송 후 인증 단계 (두번째 단계) */}
      {findPwStage === "verifyCode" && (
        <Form {...verifyEmailForm}>
          <VerifyCodeForm handleSubmit={verifyEmailForm.handleSubmit(verifyCode)} />
        </Form>
      )}

      {/* 비밀번호 재설정 (세번째 단계) */}
      {findPwStage === "resetPw" && (
        <Form {...resetPwForm}>
          <ResetPwForm handleSubmit={resetPwForm.handleSubmit(() => router.push("/auth/login"))} />
        </Form>
      )}
    </>
  );
}

type FormProps<T extends FieldValues> = { handleSubmit: ReturnType<UseFormHandleSubmit<T>> };

const SendCodeForm = ({ handleSubmit }: FormProps<SendCodeFormValues>) => {
  const { control, formState, getFieldState } = useFormContext<SendCodeFormValues>();
  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      <h2 className="text-lg font-medium">이메일을 입력해주세요</h2>
      <p>인증코드를 받을 이메일을 입력해해주세요.</p>
      <b className="text-muted-foreground">데모버전의 비밀번호 찾기는 실제 사용자 정보와 무관합니다.</b>
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
        <Button disabled={!formState.isValid || !!getFieldState("email").error} className="w-full">
          인증번호 발송
        </Button>
      </form>
    </div>
  );
};

const VerifyCodeForm = ({ handleSubmit }: FormProps<VerifyCodeFormValues>) => {
  const { control, formState, getFieldState } = useFormContext<VerifyCodeFormValues>();
  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      <h2 className="text-lg font-medium">인증 코드 확인</h2>
      <p>이메일로 발송된 인증코드 6자리를 입력해주세요.</p>
      <b className="text-muted-foreground">데모버전의 비밀번호 찾기는 실제 사용자 정보와 무관합니다.</b>
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
        <Button disabled={!formState.isValid || !!getFieldState("code").error} className="w-full">
          인증
        </Button>
      </form>
    </div>
  );
};

const ResetPwForm = ({ handleSubmit }: FormProps<ResetPwFormValues>) => {
  const { control, formState, getFieldState } = useFormContext<ResetPwFormValues>();
  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      <h2 className="text-lg font-medium">비밀번호 재설정</h2>
      <p>새로운 비밀번호 입력해 비밀번호를 변경해주세요.</p>
      <b className="text-muted-foreground">데모버전의 비밀번호 재설정은 실제 사용자 정보와 무관합니다.</b>
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
        <Button
          disabled={!formState.isValid || !!getFieldState("password").error || !!getFieldState("confirmPassword").error}
          className="w-full"
        >
          비밀번호 변경
        </Button>
      </form>
    </div>
  );
};
