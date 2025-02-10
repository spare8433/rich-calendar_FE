"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultError, useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, LoadingButton } from "@/app/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/lib/api";
import { handleMutationError } from "@/lib/utils";

const FIND_USERNAME_FORM_SCHEMA = z.object({ email: z.string().email("유효한 이메일 주소를 입력해주세요.") });
type FormValues = z.infer<typeof FIND_USERNAME_FORM_SCHEMA>;

interface FindUsernameVariables {
  req: FindUsernameReq;
}

export default function FindUsername() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(FIND_USERNAME_FORM_SCHEMA),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const { mutate, data, isSuccess, isPending } = useMutation<FindUsernameRes, DefaultError, FindUsernameVariables>({
    mutationFn: ({ req }) => apiRequest("findUsername", req),
    onSuccess: (data) => {
      if (!data.success) return toast({ title: "등록된 이메일이 존재하지 않습니다.", variant: "warning" });
    },
    onError: (error) =>
      handleMutationError(error, {
        400: () => toast({ title: "로그인에 실패했습니다 입력하신정보를 다시확인해주세요.", variant: "warning" }),
        404: () => toast({ title: "로그인에 실패했습니다 입력하신정보를 다시확인해주세요.", variant: "warning" }),
        default: () =>
          toast({
            title: "로그인이 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
            variant: "destructive",
          }),
      }),
  });

  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      {isSuccess && data.success ? (
        <>
          <h2 className="text-lg font-medium">아이디 정보 확인</h2>
          <p className="text-muted-foreground">등록하신 이메일정보를 확인해주세요.</p>
          <div className="border-border w-full space-y-4 rounded-lg border py-4 text-center">
            <p>아이디 : {data.username}</p>
            <p>생성일 : {dayjs(data.createdAt).format("YYYY-MM-DD")}</p>
          </div>
          <Button type="button" className="w-full" onClick={() => router.push("/auth/login")}>
            로그인 화면으로
          </Button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-medium">아이디 찾기</h2>
          <p className="text-muted-foreground">등록하신 이메일정보를 입력해주세요.</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutate({ req: data }))}
              className="flex w-full flex-col gap-y-4"
            >
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
              <LoadingButton isLoading={isPending} className="w-full">
                아이디 찾기
              </LoadingButton>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
