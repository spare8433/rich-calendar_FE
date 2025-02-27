"use client";

import { CustomToast } from "@/app/components/custom-toast";
import { ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/app/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <CustomToast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </CustomToast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
