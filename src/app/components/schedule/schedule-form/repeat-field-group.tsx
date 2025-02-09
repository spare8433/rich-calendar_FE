"use client";

import { useFormContext } from "react-hook-form";

import { FormValues } from "@/app/components/schedule/schedule-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { REPEAT_FREQUENCY_TYPE } from "@/constants";
import { cn } from "@/lib/utils";

export default function RepeatFieldGroup() {
  const { control, formState, watch, trigger } = useFormContext<FormValues>();
  const { isRepeat } = watch();

  const getPeriodErrorMessage = () => {
    const { repeatInterval, repeatFrequency } = formState.errors;
    if (repeatInterval) return `${repeatInterval.message} -1`;
    else if (repeatFrequency) return repeatFrequency.message;
    else return undefined;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-4">
        <span className="text-sm font-medium">반복</span>
        {/* 반복 사용 여부 radio group */}
        <FormField
          name="isRepeat"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {/* radio group control 영역 */}
                <RadioGroup
                  defaultValue={field.value}
                  className="flex items-center gap-x-4"
                  disabled={field.disabled}
                  onValueChange={(value) => {
                    field.onChange(value);
                    return trigger(["isRepeat", "repeatEndCount", "repeatFrequency", "repeatInterval"]);
                  }}
                >
                  {/* "사용" radio button */}
                  <div className="flex items-center gap-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">사용</FormLabel>
                  </div>

                  {/* "사용 안함" radio button */}
                  <div className="flex items-center gap-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">사용 안함</FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 종료 옵션 목록 Box : 반복 기준, 종료 기준 */}
      <div className={cn("flex flex-col gap-y-2 rounded-lg border px-4 py-3")}>
        {/* 반복 옵션 fields: 반복횟수, 반복주기 */}
        <div className="flex gap-x-2">
          <span className="mr-4 text-sm font-medium leading-10">반복 기준</span>
          <div>
            <div className="flex gap-x-2">
              {/* 반복 주기 횟수 input number */}
              <FormField
                name="repeatInterval"
                control={control}
                disabled={isRepeat === "no"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        className="w-16"
                        aria-label="반복 주기 횟수"
                        {...field}
                        value={field.value ?? 1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* 반복 주기 select */}
              <FormField
                name="repeatFrequency"
                control={control}
                disabled={isRepeat === "no"}
                render={({ field }) => (
                  <Select
                    defaultValue={field.value ?? "weekly"}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // changeRepeatPeriod();
                    }}
                    disabled={field.disabled}
                  >
                    <FormControl className="w-20">
                      <SelectTrigger aria-label="반복 주기 선택">
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Object.entries(REPEAT_FREQUENCY_TYPE).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* 반복 옵션 fields 통합 에러메시지 */}
            {getPeriodErrorMessage() && <div className="text-destructive pl-2 text-sm">{getPeriodErrorMessage()}</div>}
          </div>
        </div>

        {/* 종료 기준 fields */}
        <div className="flex gap-x-2">
          <span className="mr-4 text-sm font-medium leading-10">일정 반복 횟수</span>
          <FormField
            control={control}
            name="repeatEndCount"
            disabled={isRepeat === "no"}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    className="w-16"
                    aria-label="반복 종료 횟수"
                    {...field}
                    value={field.value ?? 1}
                  />
                </FormControl>
                {!field.disabled && <FormMessage />}
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
