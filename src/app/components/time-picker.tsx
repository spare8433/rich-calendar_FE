import { Input } from "@/app/components/ui/input";
import { cn } from "@/lib/utils";

export default function TimePicker({ className, ...rest }: React.ComponentProps<"input">) {
  return (
    <Input
      type="time"
      className={cn(
        "border-input bg-background hover:bg-accent hover:text-accent-foreground w-fit cursor-pointer border font-normal",
        className,
      )}
      {...rest}
    />
  );
}
