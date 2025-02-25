import { ReactNode } from "react";
import { SubmitErrorHandler, SubmitHandler, useFormContext } from "react-hook-form";

import ColorTitleField from "./fields/color-title-field";
import DateRangeField from "./fields/date-range-field";
import DescriptionField from "./fields/description-field";
import ImportanceField from "./fields/importance-field";
import RepeatFieldGroup from "./fields/repeat-field-group";
import TagsField from "./fields/tags-field";
import { ScheduleFormValues } from "./form-schema";

interface ScheduleFormProps {
  children: ReactNode;
  onSubmit: SubmitHandler<ScheduleFormValues>;
  onSubmitError?: SubmitErrorHandler<ScheduleFormValues>;
}

export const ScheduleForm = ({ children, onSubmit, onSubmitError }: ScheduleFormProps) => {
  const form = useFormContext<ScheduleFormValues>();
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
