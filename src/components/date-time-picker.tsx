import dayjs from "dayjs";
import { DayPickerSingleProps } from "react-day-picker";

import { DatePicker, DatePickerContent, DatePickerTrigger } from "@/components/date-picker";
import TimePicker from "@/components/time-picker";

interface Props {
  date: string | Date;
  dateAriaLabel?: string;
  datePickerProps: Omit<DayPickerSingleProps, "mode" | "selected">;
  timePickerProps: React.ComponentProps<"input">;
}

function DateTimePicker({ date, dateAriaLabel, datePickerProps, timePickerProps }: Props) {
  const { className, ...rest } = datePickerProps;
  return (
    <div className="flex items-center gap-2">
      {/* date picker(년, 월, 일) */}
      <DatePicker>
        <DatePickerTrigger aria-label={`${dateAriaLabel} 년, 월, 일 선택`} className={className}>
          {dayjs(date).format("YYYY-MM-DD")}
        </DatePickerTrigger>
        <DatePickerContent value={new Date(date)} showOutsideDays={false} {...rest} />
      </DatePicker>

      {/* time picker */}
      <TimePicker
        value={dayjs(date).format("HH:mm")}
        aria-label={`${dateAriaLabel} 시, 분 선택`}
        {...timePickerProps}
      />
    </div>
  );
}

export default DateTimePicker;
