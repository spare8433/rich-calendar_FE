import { ReactNode } from "react";
import { SubmitErrorHandler, SubmitHandler, useFormContext } from "react-hook-form";

import ColorTitleField from "./add/schedule-form/fields/color-title-field";
import DateRangeField from "./add/schedule-form/fields/date-range-field";
import DescriptionField from "./add/schedule-form/fields/description-field";
import ImportanceField from "./add/schedule-form/fields/importance-field";
import RepeatFieldGroup from "./add/schedule-form/fields/repeat-field-group";
import TagsField from "./add/schedule-form/fields/tags-field";
import { ScheduleFormValues } from "./add/schedule-form/form-schema";

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
