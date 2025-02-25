import dayjs from "dayjs";
import { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

import DateTimePicker from "@/app/components/date-time-picker";
import { modifyOnlyDate, modifyOnlyTime } from "@/lib/date";

import { ScheduleFormValues } from "../form-schema";

export default function DateRangeField() {
  const { watch, getValues, setValue, trigger, formState } = useFormContext<ScheduleFormValues>();
  const { startDate, endDate } = watch();
  const isValidPeriod = !dayjs(startDate).isBefore(endDate);

  // 날짜 변경 이벤트 핸들러
  const handleChangeDate = (type: "startDate" | "endDate", date: Date) => {
    const updatedDateTime = modifyOnlyDate(getValues()[type], date).toISOString();
    setValue(type, updatedDateTime, { shouldDirty: true });
    trigger(["startDate", "endDate"]); // 유효성 검사
  };

  // 시간 변경 이벤트 핸들러
  const handleChangeTime = (type: "startDate" | "endDate", e: ChangeEvent<HTMLInputElement>) => {
    const updatedDateTime = modifyOnlyTime(getValues()[type], e.currentTarget.value).toISOString();
    setValue(type, updatedDateTime, { shouldDirty: true });
    trigger(["startDate", "endDate"]); // 유효성 검사
  };

  // date range field 에서 발생하는 에러 메시지 종합 후 반환하는 함수
  const getDateErrorMessage = () => {
    const { startDate: startDateError, endDate: endDateError } = formState.errors;
    if (startDateError) return startDateError.message;
    else if (endDateError) return endDateError.message;
    else return undefined;
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">시간</span>
      <div className=" flex flex-wrap items-center gap-x-2">
        {/* 시작 날짜 datetime picker  */}
        <DateTimePicker
          date={startDate}
          dateAriaLabel="시작 날짜"
          datePickerProps={{
            className: isValidPeriod ? "text-destructive hover:text-destructive" : "",
            // disabled: { after: new Date(endDate) },
            onSelect: (date, selectedDate) => handleChangeDate("startDate", selectedDate),
          }}
          timePickerProps={{
            className: isValidPeriod ? "text-destructive hover:text-destructive" : "",
            onChange: (e) => handleChangeTime("startDate", e),
          }}
        />

        <span>~</span>

        {/* 종료 날짜 datetime picker  */}
        <DateTimePicker
          date={endDate}
          dateAriaLabel="종료 날짜"
          datePickerProps={{
            disabled: { before: new Date(startDate) },
            className: isValidPeriod ? "text-destructive hover:text-destructive" : "",
            onSelect: (date, selectedDate) => handleChangeDate("endDate", selectedDate),
          }}
          timePickerProps={{
            className: isValidPeriod ? "text-destructive hover:text-destructive" : "",
            onChange: (e) => handleChangeTime("endDate", e),
          }}
        />
      </div>

      {/* 에러메시지 */}
      {getDateErrorMessage() && <div className="text-destructive pl-2 text-sm">{getDateErrorMessage()}</div>}
    </div>
  );
}
