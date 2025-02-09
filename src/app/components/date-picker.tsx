import { PopoverProps } from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { DayPickerSingleProps } from "react-day-picker";

import { Button, ButtonProps } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { FormControl } from "@/app/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { cn } from "@/lib/utils";

const DatePicker = (props: PopoverProps) => <Popover {...props} />;
DatePicker.displayName = "DatePicker";

export type DayPickerContentProps = Omit<DayPickerSingleProps, "mode"> & {
  value: Date | undefined;
};

const DatePickerContent = React.forwardRef<HTMLDivElement, DayPickerContentProps>((props, ref) => {
  const { value = new Date(), ...rest } = props;
  return (
    <PopoverContent className="w-auto p-0" align="start" ref={ref}>
      <Calendar mode="single" selected={value} {...rest} />
    </PopoverContent>
  );
});
DatePickerContent.displayName = "DatePickerContent";

const DatePickerTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, className, ...rest } = props;

  return (
    <PopoverTrigger ref={ref} asChild>
      <FormControl>
        <Button variant={"outline"} className={cn("justify-start text-left font-normal", className)} {...rest}>
          {children}
          <CalendarIcon size={16} className="ml-2 text-black" />
        </Button>
      </FormControl>
    </PopoverTrigger>
  );
});
DatePickerTrigger.displayName = "DatePickerTrigger";

export { DatePicker, DatePickerContent, DatePickerTrigger };
