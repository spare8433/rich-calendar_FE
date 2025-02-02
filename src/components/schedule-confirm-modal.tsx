import { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants, LoadingButton } from "@/components/ui/button";

type Props = {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: () => void;
};

export default function ScheduleConfirmModal(props: Props) {
  const { open, title, description, isLoading, onOpenChange, onAction } = props;
  return (
    <AlertDialog open={open} defaultOpen={true} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className={buttonVariants({ variant: "outline", size: "lg" })}>취소</AlertDialogCancel>
          <AlertDialogAction className={buttonVariants({ size: "lg" })} onClick={() => onAction()} asChild>
            <LoadingButton isLoading={isLoading}>확인</LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
