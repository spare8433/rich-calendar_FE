"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultError, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LoadingButton } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/lib/api";
import { handleMutationError } from "@/lib/utils";

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

interface LoginVariables {
  req: LoginReq;
}

export default function Login() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(LOGIN_FORM_SCHEMA),
    defaultValues: { username: "", password: "" },
  });

  const { mutate, isPending } = useMutation<null, DefaultError, LoginVariables>({
    mutationFn: ({ req }) => apiRequest("login", req),
    onSuccess: () => router.push("/"),
    onError: (error) =>
      handleMutationError(error, {
        400: () => toast({ title: "로그인에 실패했습니다 입력하신 정보를 다시 확인해주세요.", variant: "warning" }),
        404: () => toast({ title: "로그인에 실패했습니다 입력하신 정보를 다시 확인해주세요.", variant: "warning" }),
        default: () =>
          toast({
            title: "로그인이 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
            variant: "destructive",
          }),
      }),
  });

  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      <h2 className="text-lg font-medium">로그인</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutate({ req: data }))} className="flex w-full flex-col gap-y-4">
          <FormField
            name="username"
            control={form.control}
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
          <FormField
            name="password"
            control={form.control}
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
          <LoadingButton isLoading={isPending} className="w-full">
            로그인
          </LoadingButton>
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
