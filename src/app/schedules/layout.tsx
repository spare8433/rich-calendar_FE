"use client";

import FullCalendar from "@fullcalendar/react";
import { useRef } from "react";

import { CalendarProvider } from "@/contexts/calendar";

interface Props {
  children: React.ReactNode;
}

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

import { buttonVariants } from "../components/ui/button";

export default function Layout({ children }: Props) {
  const calendarRef = useRef<FullCalendar>(null);
  return (
    <>
      <CalendarProvider calendarRef={calendarRef}>{children}</CalendarProvider>;
      <AlertDialog defaultOpen={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rich Calendar Demo 페이지입니다.</AlertDialogTitle>
            <AlertDialogDescription>
              현재 페이지는 Rich Calendar Demo 버전으로 Rich Calendar 사이트의 일부 기능을 체험할 수 있는 페이지 입니다.
              따라서 일부 기능이 실제와 다르거나 작동하지 않을 수 있습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full")}>
              닫기
            </AlertDialogCancel>
            {/* <AlertDialogCancel className={"w-full"}>닫기</AlertDialogCancel> */}
            {/* <AlertDialogAction>Continue</AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
