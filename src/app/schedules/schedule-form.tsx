import { CheckedState } from "@radix-ui/react-checkbox";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChangeEvent, ReactNode, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useFormContext } from "react-hook-form";
import { z } from "zod";

import BasicLoader from "@/app/components/basic-loader";
import DateTimePicker from "@/app/components/date-time-picker";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Separator } from "@/app/components/ui/separator";
import { Textarea } from "@/app/components/ui/textarea";
import { REPEAT_FREQUENCY_TYPE } from "@/constants";
import { COLORS, IMPORTANCE, IMPORTANCE_TYPE, INVALID_TYPE_ERROR, REPEAT_FREQUENCY } from "@/constants";
import apiRequest from "@/lib/api";
import { modifyOnlyDate, modifyOnlyTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import { getScheduleColorVariable } from "@/lib/utils";

export const scheduleSchema = z.object({
  title: z
    .string()
    .max(50, { message: "제목은 최대 50자까지 작성가능합니다." })
    .min(2, { message: "제목은 최소 2자 이상 작성해야합니다." }),
  color: z.enum([...COLORS], INVALID_TYPE_ERROR),
  startDate: z.string().refine((startDate) => dayjs(startDate).isValid(), {
    ...INVALID_TYPE_ERROR,
    path: ["startDate"],
  }),
  endDate: z.string().refine((endDate) => dayjs(endDate).isValid(), {
    ...INVALID_TYPE_ERROR,
    path: ["endDate"],
  }),
  description: z
    .string()
    .max(200, { message: "설명은 최대 200자까지 작성가능합니다." })
    .min(2, { message: "설명은 최소 2자 이상 작성해야합니다." }),
  tags: z.array(z.object({ id: z.number(), title: z.string() }, INVALID_TYPE_ERROR)),
  importance: z.enum(IMPORTANCE, INVALID_TYPE_ERROR),
  isRepeat: z.enum(["yes", "no"], INVALID_TYPE_ERROR),
  repeatInterval: z.coerce
    .number()
    .min(1, { message: "반복 횟수 최소값은 1입니다." })
    .max(30, { message: "반복 횟수 최대값은 30입니다." })
    .optional(),
  repeatFrequency: z.enum(REPEAT_FREQUENCY, INVALID_TYPE_ERROR).optional(),
  repeatEndCount: z.coerce
    .number()
    .min(1, { message: "반복 종료 횟수 최소값은 1입니다." })
    .max(30, { message: "반복 종료 횟수 최대값은 30입니다." })
    .optional(),
});

export type FormValues = z.infer<typeof scheduleSchema>;

interface ScheduleFormProps {
  children: ReactNode;
  onSubmit: SubmitHandler<FormValues>;
  onSubmitError?: SubmitErrorHandler<FormValues>;
}

export const ScheduleForm = ({ children, onSubmit, onSubmitError }: ScheduleFormProps) => {
  const form = useFormContext<FormValues>();
  return (
    <form onSubmit={form.handleSubmit(onSubmit, onSubmitError)} className="box-border flex w-full flex-col gap-y-4">
      <ColorTitleField />
      <DateRangeField />
      <DescriptionField />
      <TagsField />
      <ImportanceField />
      <RepeatFieldGroup />
      {children}
    </form>
  );
};

const ColorOption = ({ color }: { color: ColorType }) => (
  <div className="flex items-center gap-2">
    <div className="size-4 rounded-full bg-[hsl(var(--schedule))]" style={getScheduleColorVariable(color)} />
    {color}
  </div>
);

const ColorTitleField = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <div className="flex items-start gap-x-2">
      {/* color picker */}
      <FormField
        control={control}
        name="color"
        render={({ field }) => {
          const { value, onChange } = field;
          return (
            <FormItem>
              <FormLabel>색상</FormLabel>
              <Select defaultValue={value} onValueChange={onChange}>
                <FormControl>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={<ColorOption color={value} />} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent collisionPadding={{ left: 0 }}>
                  {COLORS.map((color) => (
                    <SelectItem key={color} value={color}>
                      <ColorOption color={color} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      {/* title input */}
      <FormField
        name="title"
        control={control}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>제목</FormLabel>
            <FormControl>
              <Input placeholder="제목" type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const DateRangeField = () => {
  const { watch, getValues, setValue, trigger, formState } = useFormContext<FormValues>();
  const { startDate, endDate } = watch();
  const isValidPeriod = !dayjs(startDate).isBefore(endDate);

  // 날짜 변경 이벤트 핸들러
  const handleChangeDate = (type: "startDate" | "endDate", date: Date) => {
    const updatedDateTime = modifyOnlyDate(getValues()[type], date).toString();
    setValue(type, updatedDateTime);
    trigger(["startDate", "endDate"]); // 유효성 검사
  };

  // 시간 변경 이벤트 핸들러
  const handleChangeTime = (type: "startDate" | "endDate", e: ChangeEvent<HTMLInputElement>) => {
    const updatedDateTime = modifyOnlyTime(getValues()[type], e.currentTarget.value).toString();
    setValue(type, updatedDateTime);
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
};

const DescriptionField = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <FormField
      name="description"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>설명</FormLabel>
          <FormControl>
            <Textarea className="resize-none" maxLength={200} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const TagsField = () => {
  const { data, isSuccess } = useQuery({
    queryKey: ["scheduleTags"],
    queryFn: () => apiRequest("getScheduleTags"),
  });

  const { watch, setValue } = useFormContext<FormValues>();
  const { tags } = watch();

  // 현재 체크된 tag id 목록 state 초기값은 form 의 초기 tag id 목록
  const [checkedTagIds, setCheckedTagsIds] = useState<number[]>(tags.map(({ id }) => id));

  const handleCheckedChange = (checked: CheckedState, tagId: number) => {
    if (!data) return;

    const currentTagsSet = new Set(checkedTagIds);
    checked ? currentTagsSet.add(tagId) : currentTagsSet.delete(tagId);
    setCheckedTagsIds(Array.from(currentTagsSet));

    // 체크된 tag id 기반으로 form value 변경
    setValue(
      "tags",
      data.tags.filter((tag) => currentTagsSet.has(tag.id)),
    );
  };

  const getCheckBoxChecked = (tagId: number) => new Set(checkedTagIds).has(tagId);

  return (
    <div className="space-y-3">
      <div className="mb-3 flex items-center gap-x-4">
        <span className="text-sm font-medium">분류</span>

        {/* tag 수정 popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="default" size="sm">
              태그 변경
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 space-y-3" side="right">
            <h2 className="text-sm font-medium">분류 수정</h2>
            <Separator />
            {isSuccess ? (
              <div className="space-y-3">
                {data.tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${tag.id}-${tag.title}`}
                      defaultChecked={getCheckBoxChecked(tag.id)}
                      onCheckedChange={(checked) => handleCheckedChange(checked, tag.id)}
                    />
                    <Label htmlFor={`${tag.id}-${tag.title}`}>{tag.title}</Label>
                  </div>
                ))}
              </div>
            ) : (
              <BasicLoader />
            )}
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        {/* 실제 활성화된 tag 목록 */}
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <div key={tag.id} className="border-muted-foreground rounded-full border px-3 py-1.5 text-sm font-medium">
              {tag.title}
            </div>
          ))
        ) : (
          <span className="text-muted-foreground text-sm">지정된 태그가 존재하지 않습니다.</span>
        )}
      </div>
    </div>
  );
};

const ImportanceField = () => {
  const { control, trigger } = useFormContext<FormValues>();
  return (
    <FormField
      name="importance"
      control={control}
      render={({ field }) => {
        const { value, onChange, disabled } = field;
        return (
          <FormItem className="flex items-center space-x-6 space-y-0">
            <FormLabel>중요도</FormLabel>
            <Select
              defaultValue={value ?? "medium"}
              disabled={disabled}
              onValueChange={(value) => {
                onChange(value);
                trigger(field.name); // 유효성 검사
              }}
            >
              <FormControl>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder={IMPORTANCE_TYPE[value ?? "medium"]} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(IMPORTANCE_TYPE).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

const RepeatFieldGroup = () => {
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
                  // onValueChange={field.onChange}
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
      <div className={cn("flex flex-col gap-y-2 rounded-lg border px-4 py-3", isRepeat === "no" && "hidden")}>
        {/* 반복 옵션 fields: 반복횟수, 반복주기 */}
        <div className="flex gap-x-2">
          <span className="mr-4 text-sm font-medium leading-10">반복 기준</span>
          <div>
            <div className="flex gap-x-2">
              {/* 반복 주기 횟수 input number */}
              <FormField
                name="repeatInterval"
                control={control}
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
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                render={({ field }) => (
                  <Select defaultValue={field.value ?? "weekly"} onValueChange={(value) => field.onChange(value)}>
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
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
};
