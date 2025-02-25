"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import VerifyEmailModal from "@/app/auth/signup/verify-modal";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { SERVICE, TERMS } from "@/constants";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const router = useRouter();
  const { toast } = useToast();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(SIGNUP_SCHEMA),
    mode: "onBlur",
    defaultValues: { username: "", email: "", password: "", confirmPassword: "", agreeToTerms: false },
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-y-6">
        <h1 className="text-xl font-medium">회원가입</h1>
        <b className="text-muted-foreground">데모버전에서는 실제 회원가입이 이루어지지 않습니다.</b>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => router.push("/"))} className="flex w-full flex-col gap-y-4">
            <UsernameField />
            <EmailField openVerifyEmail={() => setIsEmailModalOpen(true)} />
            <PasswordField />
            <ConfirmPasswordField />
            <AgreeToTermsField />
            <Button className="w-full" disabled={!form.formState.isValid || !!form.getFieldState("username").error}>
              회원가입
            </Button>
          </form>
        </Form>
      </div>

      {/* 이메일 인증 모달 */}
      {isEmailModalOpen && (
        <VerifyEmailModal
          changeIsOpen={(open: boolean) => setIsEmailModalOpen(open)}
          updateEmail={(email: string) => {
            form.setValue("email", email);
            form.trigger("email");
          }}
        />
      )}

      {isSignup && (
        <Dialog open={isSignup} onOpenChange={setIsSignup}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>회원가입 완료</DialogTitle>
              <DialogDescription>
                회원가입 완료됐으며 데모 버전이므로 실제 사용자가 생성되지는 않습니다.
              </DialogDescription>
            </DialogHeader>
            <div>
              <p>username: {form.getValues("username")}</p>
              <p>email: {form.getValues("email")}</p>
            </div>
            <DialogFooter>
              <Button className="w-full" type="submit">
                홈으로
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

const SIGNUP_SCHEMA = z
  .object({
    username: z
      .string()
      .min(5, "아이디는 최소 5자 이상이어야 합니다.")
      .max(20, "아이디는 최대 20자 이하이어야 합니다.")
      .regex(/^[a-zA-Z0-9._-]+$/, "아이디는 영문자, 숫자, 점, 밑줄, 하이픈만 사용할 수 있습니다."),
    email: z.string().email("유효한 email 주소를 입력해주세요."),
    password: z
      .string()
      .min(9, "비밀번호는 최소 9자 이상이어야 합니다.")
      .max(32, "비밀번호는 최대 32자 이하이어야 합니다.")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/,
        "비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.",
      ),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((value) => value === true, "약관 동의가 필요합니다."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof SIGNUP_SCHEMA>;

const UsernameField = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <FormField
      name="username"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>아이디</FormLabel>
          <FormControl>
            <Input placeholder="아이디" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const EmailField = ({ openVerifyEmail }: { openVerifyEmail: () => void }) => {
  const { control } = useFormContext<FormValues>();
  return (
    <FormField
      name="email"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>이메일</FormLabel>
          <div className="flex items-center gap-x-2">
            <FormControl>
              <Input placeholder="이메일" {...field} className={"bg-muted text-muted-foreground"} readOnly />
            </FormControl>
            <Button type="button" variant="secondary" size="sm" className="font-medium" onClick={openVerifyEmail}>
              이메일 인증
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const PasswordField = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <FormField
      name="password"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>비밀번호</FormLabel>
          <FormControl>
            <Input type="password" placeholder="비밀번호" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const ConfirmPasswordField = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <FormField
      name="confirmPassword"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>비밀번호 확인</FormLabel>
          <FormControl>
            <Input type="password" placeholder="비밀번호 확인" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const PolicyButton = (props: { children: ReactNode; onClick: () => void }) => (
  <Button type="button" variant="link" size={null} className="font-medium" {...props} />
);

interface PolicyModalProps {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
}

const PolicyModal = (props: PolicyModalProps) => {
  const { open, title, children, onOpenChange } = props;
  return (
    <AlertDialog open={open} defaultOpen={true} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription className="sr-only">{title} 설명</AlertDialogDescription>
        <Textarea className="h-60 resize-none" readOnly value={children as string} />
        <AlertDialogCancel>닫기</AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const AgreeToTermsField = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const { control } = useFormContext<FormValues>();
  return (
    <>
      <FormField
        name="agreeToTerms"
        control={control}
        render={({ field }) => (
          <FormItem className="mb-4 mt-2">
            <div className="flex items-center gap-x-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="font-normal">
                <PolicyButton onClick={() => setIsServiceOpen(true)}>이용약관</PolicyButton>
                &nbsp;및&nbsp;
                <PolicyButton onClick={() => setIsTermsOpen(true)}>개인정보처리방침</PolicyButton>에 동의합니다.
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 개인정보처리방침, 이용약관 modal */}
      <PolicyModal title="개인정보처리방침" open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        {TERMS}
      </PolicyModal>
      <PolicyModal title="이용약관" open={isServiceOpen} onOpenChange={setIsServiceOpen}>
        {SERVICE}
      </PolicyModal>
    </>
  );
};
