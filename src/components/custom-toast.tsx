import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { ComponentProps, JSX } from "react";

import { Toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const variantObject: Record<string, { icon: JSX.Element; duration: number }> = {
  default: {
    icon: <Info className="text-blue" />,
    duration: 3000,
  },
  success: {
    icon: <CheckCircle className="text-green size-6" />,
    duration: 3000,
  },
  warning: {
    icon: <AlertTriangle className="text-yellow size-6" />,
    duration: 5000,
  },
  destructive: {
    icon: <XCircle className="text-pink size-6" />,
    duration: 6000,
  },
};

export function CustomToast({ variant, children, className, duration, ...props }: ComponentProps<typeof Toast>) {
  const icon = variantObject[variant ?? "default"].icon;

  return (
    <Toast
      className={cn("flex items-start", className)}
      duration={duration ?? variantObject[variant ?? "default"].duration}
      variant={variant}
      {...props}
    >
      <div className="flex items-center space-x-4">
        <div>{icon}</div>
        {children}
      </div>
    </Toast>
  );
}
