"use client";

import { ChevronDown, LogOut, Trash2 } from "lucide-react";

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
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  return (
    <header className="bg-muted flex h-12 items-center justify-between border-b px-4">
      {/* 로고 */}
      <h1 className="font-medium">Rich Calendar</h1>

      {/* 사용자 정보(클릭시 상세 정보 및 기타 기능 제공) */}
      <UserPopover />
    </header>
  );
}

const UserPopover = () => {
  const { toast } = useToast();

  return (
    <Popover>
      {/* 사용자 아바타 */}
      <PopoverTrigger className="flex items-center gap-x-2">
        <Sign size="xs" />
        <span>demoUser</span>
        <ChevronDown size={18} />
      </PopoverTrigger>

      {/* 아바타 클릭시 노출되는 사용자 정보 popover */}
      <PopoverContent side="bottom" className="mr-4 w-fit max-w-96 space-y-2 overflow-hidden p-4">
        <div className="flex items-center space-x-4">
          {/* 사용자 썸네일 이미지 */}
          <Sign size="sm" />

          {/* 사용자 정보 */}
          <div>
            <p className="text-base font-medium">demoUser</p>
            <p className="text-muted-foreground text-sm">yourWatchDemo.rich.calendar</p>
          </div>
        </div>

        <Separator />

        <Button
          type="button"
          className="w-full justify-start space-x-4"
          variant="ghost"
          onClick={() => toast({ title: "데모 버전에서는 사용할 수 없는 기능입니다.", variant: "success" })}
        >
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
              <AlertDialogTitle>취소</AlertDialogTitle>
              <AlertDialogDescription>정말로 회원탈퇴를 진행하시겠습니까?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className={buttonVariants({ variant: "outline", size: "lg" })}>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => toast({ title: "데모 버전에서는 사용할 수 없는 기능입니다.", variant: "success" })}
                className={buttonVariants({ variant: "destructive", size: "lg" })}
              >
                탈퇴
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PopoverContent>
    </Popover>
  );
};
