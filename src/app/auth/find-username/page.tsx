"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/app/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";

const findUsernameFormSchema = z.object({ email: z.string().email("유효한 이메일 주소를 입력해주세요.") });
type FormValues = z.infer<typeof findUsernameFormSchema>;

export default function FindUsername() {
  const router = useRouter();

  const [mode, setMode] = useState<"inputEmail" | "checkUsername">("inputEmail");

  const form = useForm<FormValues>({
    resolver: zodResolver(findUsernameFormSchema),
    defaultValues: { email: "yourWatchDemo@rich.calendar" },
    mode: "onChange",
  });

  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      {mode === "inputEmail" && (
        <>
          <h2 className="text-lg font-medium">아이디 찾기</h2>
          <p className="text-muted-foreground">등록하신 이메일정보를 입력해주세요.</p>
          <b className="text-muted-foreground">데모버전의 아이디 찾기는 실제 사용자 정보와 무관합니다.</b>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => setMode("checkUsername"))} className="flex w-full flex-col gap-y-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-4 w-full">
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input placeholder="이메일" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full">아이디 찾기</Button>
            </form>
          </Form>
        </>
      )}
      {mode === "checkUsername" && (
        <>
          <h2 className="text-lg font-medium">아이디 정보 확인</h2>
          <p className="text-muted-foreground">등록하신 이메일정보를 확인해주세요.</p>
          <b className="text-muted-foreground">데모버전의 아이디 찾기는 실제 사용자 정보와 무관합니다.</b>
          <div className="border-border w-full space-y-4 rounded-lg border py-4 text-center">
            <p>아이디 : demoUser</p>
            <p>생성일 : 2024-01-01</p>
          </div>
          <Button type="button" className="w-full" onClick={() => router.push("/auth/login")}>
            로그인 화면으로
          </Button>
        </>
      )}
    </div>
  );
}
