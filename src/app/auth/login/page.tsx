"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { login } from "@/actions";
import { Button } from "@/app/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const LOGIN_FORM_SCHEMA = z.object({
  username: z
    .string()
    .min(5, "아이디는 최소 5자 이상이어야 합니다.")
    .max(20, "아이디는 최대 20자 이하이어야 합니다.")
    .regex(/^[a-zA-Z0-9._-]+$/, "아이디는 영문자, 숫자, 점, 밑줄, 하이픈만 사용할 수 있습니다."),
  password: z
    .string()
    .min(9, "비밀번호는 최소 9자 이상이어야 합니다.")
    .max(32, "비밀번호는 최대 32자 이하이어야 합니다.")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/,
      "비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.",
    ),
});

type FormValues = z.infer<typeof LOGIN_FORM_SCHEMA>;

export default function Login() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(LOGIN_FORM_SCHEMA),
    defaultValues: { username: "demoUser", password: "thisIsNotRealPassword1!" },
  });

  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      <h2 className="text-lg font-medium">로그인</h2>
      <b className="text-muted-foreground">데모버전의 로그인으로 실제 사용자 정보와 무관합니다.</b>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(login)} className="flex w-full flex-col gap-y-4">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>아이디</FormLabel>
                <FormControl>
                  <Input placeholder="아이디" readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input readOnly type="password" placeholder="비밀번호" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full">로그인</Button>
        </form>
      </Form>

      <div className="text-muted-foreground divide-muted-foreground flex divide-x">
        <Link href="/auth/find-username" className="px-3 text-sm">
          아이디 찾기
        </Link>
        <Link href="/auth/find-pw" className="px-3 text-sm">
          비밀번호 찾기
        </Link>
        <Link href="/auth/signup" className="px-3 text-sm">
          회원가입
        </Link>
      </div>
    </div>
  );
}
