import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { COLORS } from "@/constants";
import { getScheduleColorVariable } from "@/lib/utils";

import { ScheduleFormValues } from "../form-schema";

const ColorOption = ({ color }: { color: ColorType }) => (
  <div className="flex items-center gap-2">
    <div className="size-4 rounded-full bg-[hsl(var(--schedule))]" style={getScheduleColorVariable(color)} />
    {color}
  </div>
);

export default function ColorTitleField() {
  const { control } = useFormContext<ScheduleFormValues>();
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
}
