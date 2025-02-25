import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Textarea } from "@/app/components/ui/textarea";

import { ScheduleFormValues } from "../form-schema";

export default function DescriptionField() {
  const { control } = useFormContext<ScheduleFormValues>();
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
}
