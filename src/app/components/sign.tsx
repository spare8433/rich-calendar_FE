import { UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Props {
  src?: string;
  size: keyof typeof sizes;
  className?: string;
}
const sizes = {
  xs: "size-9" /* 36px */,
  sm: "size-12" /* 48px */,
  md: "size-16" /* 64px */,
};

const innerSizes = {
  xs: 18,
  sm: 24,
  md: 32,
};

export default function Sign({ src, size, className }: Props) {
  return (
    <Avatar className={cn(className, sizes[size])}>
      <AvatarImage src={src && src} />
      <AvatarFallback className="bg-background border">
        <UserRound size={innerSizes[size]} className="text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
  );
}
