"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { ToastAction } from "@/app/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import generateCode from "@/lib/utils";

import { SendCodeFormValues, sendCodeSchema, VerifyCodeFormValues, verifyCodeSchema } from "../schemas";

interface VerifyEmailModalProps {
  changeIsOpen: (open: boolean) => void;
  updateEmail: (email: string) => void;
}

export default function VerifyEmailModal({ changeIsOpen, updateEmail }: VerifyEmailModalProps) {
  const { toast } = useToast();
  const [verifyEmailStage, setVerifyEmailStage] = useState<"sendCode" | "viewCode" | "verifyCode">("sendCode");
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

  const { email } = sendEmailForm.watch();
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
    setVerifyEmailStage("verifyCode");
  };

  const verifyCode = () => {
    if (generatedCode !== code) return toast({ title: "인증코드가 일치하지 않습니다", variant: "warning" });

    updateEmail(email); // 인증코드 인증한 이메일을 회원가입 "email" 필드에 등록
    changeIsOpen(false);
  };

  return (
    <Dialog open={true} onOpenChange={changeIsOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        {verifyEmailStage === "sendCode" && (
          <Form {...sendEmailForm}>
            <form onSubmit={sendEmailForm.handleSubmit(sendCode)} className="space-y-6">
              <DialogHeader>
                <DialogTitle>이메일을 입력해주세요</DialogTitle>
                <DialogDescription>데모 버전에서는 이메일로 코드가 발송되지 않습니다.</DialogDescription>
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
              <Button
                disabled={!sendEmailForm.formState.isValid || !!sendEmailForm.getFieldState("email").error}
                className="w-full"
              >
                인증번호 발송
              </Button>
            </form>
          </Form>
        )}

        {verifyEmailStage === "verifyCode" && (
          <Form {...verifyEmailForm}>
            <form onSubmit={verifyEmailForm.handleSubmit(verifyCode)} className="space-y-6">
              <DialogHeader>
                <DialogTitle>인증 코드 확인</DialogTitle>
                <DialogDescription>발급된 인증코드 6자리를 입력해주세요.</DialogDescription>
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
              <Button
                disabled={!verifyEmailForm.formState.isValid || !!verifyEmailForm.getFieldState("code").error}
                className="w-full"
              >
                인증
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
