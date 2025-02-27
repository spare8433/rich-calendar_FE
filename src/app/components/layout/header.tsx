"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronDown, LogOut, RotateCw, Trash2 } from "lucide-react";

import { logout } from "@/actions";
import Sign from "@/app/components/sign";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/app/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Separator } from "@/app/components/ui/separator";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/lib/api";
import { handleMutationError } from "@/lib/utils";

import ErrorBoundary from "../error-boundary";

export default function Header() {
  return (
    <header className="bg-muted flex h-12 items-center justify-between border-b px-4">
      {/* 로고 */}
      <h1 className="font-medium">Rich Calendar</h1>

      {/* 사용자 정보(클릭시 상세 정보 및 기타 기능 제공) */}
      <ErrorBoundary
        FallbackComponent={({ resetErrorBoundary }) => (
          <div className="flex items-center">
            <p className="text-muted-foreground text-sm">사용자 정보를 불러오지 못했습니다.</p>
            <Button type="button" variant={null} size="icon-sm" onClick={() => resetErrorBoundary()}>
              <RotateCw className="text-primary" size={18} />
            </Button>
          </div>
        )}
      >
        <UserPopover />
      </ErrorBoundary>
    </header>
  );
}

const UserPopover = () => {
  const { toast } = useToast();

  const { data, isSuccess } = useQuery({
    retry: false,
    throwOnError: true,
    queryKey: ["myInfo"],
    queryFn: () => apiRequest("getMyInfo"),
  });

  const { mutate: withdrawMutate } = useMutation({
    mutationFn: () => apiRequest("withdrawMember"),
    onSuccess: () => logout(),
    onError: (error) =>
      handleMutationError(error, {
        default: () =>
          toast({
            title: "회원 탈퇴가 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
            variant: "destructive",
          }),
      }),
  });

  if (!isSuccess)
    return (
      <div className="flex items-center gap-x-1">
        <Skeleton className="bg-muted-foreground size-9 rounded-full" />
        <Skeleton className="bg-muted-foreground h-6 w-24" />
      </div>
    );
  // if (isError)
  //   return (
  // <div>
  //   <p className="font-bold">정보를 불러오지 못했습니다.</p>
  //   <Button type="button" onClick={() => refetch()}>
  //     다시시도
  //   </Button>
  // </div>
  //   );

  return (
    <>
      <Popover>
        {/* 사용자 아바타 */}
        <PopoverTrigger className="flex items-center gap-x-2">
          <Sign size="xs" />
          <span>{data.username}</span>
          <ChevronDown size={18} />
        </PopoverTrigger>

        {/* 아바타 클릭시 노출되는 사용자 정보 popover */}
        <PopoverContent side="bottom" className="mr-4 w-fit max-w-96 space-y-2 overflow-hidden p-4">
          <div className="flex items-center space-x-4">
            {/* 사용자 썸네일 이미지 */}
            <Sign size="sm" />

            {/* 사용자 정보 */}
            <div>
              <p className="text-base font-medium">{data.username}</p>
              <p className="text-muted-foreground text-sm">{data.email}</p>
            </div>
          </div>

          <Separator />

          <Button type="button" className="w-full justify-start space-x-4" variant="ghost" onClick={() => logout()}>
            <LogOut size="14" />
            <span>로그아웃</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" className="w-full justify-start space-x-4" variant="destructive">
                <Trash2 size="14" />
                <span>회원 탈퇴</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>회원 탈퇴</AlertDialogTitle>
                <AlertDialogDescription>정말로 회원탈퇴를 진행하시겠습니까?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className={buttonVariants({ variant: "outline", size: "lg" })}>
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => withdrawMutate()}
                  className={buttonVariants({ variant: "destructive", size: "lg" })}
                >
                  탈퇴
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </PopoverContent>
      </Popover>
    </>
  );
};
