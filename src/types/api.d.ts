interface GetSchedulesReq {
  start_date: string; // ISO8601
  end_date: string; // ISO8601
  tag_ids?: number[];
}

interface GetSchedulesRes {
  schedules: Schedule[];
}

interface GetScheduleParam {
  sid: string;
}

interface GetScheduleRes {
  id: number;
  title: string;
  description: string;
  importance: ScheduleImportanceType;
  color: ColorType;
  tags: Tag[];
  start_date: string; // ISO8601
  end_date: string; // ISO8601
  is_repeat: boolean;
  repeat_frequency: RepeatFrequencyType;
  repeat_interval: number;
  repeat_end_option?: "count" | "end_date" | "none";
  repeat_endDate?: string | null; // ISO8601
  repeat_end_count?: number | null;
}

interface GetScheduleTagsRes {
  schedule_tags: Tag[];
}

interface GetSummarySchedulesReq {
  selected_date: string; // ISO8601 (YYYY-MM-DD)
  tag_ids?: number[];
}

interface GetSummarySchedulesRes {
  side_schedules: SummarySchedule[];
}

interface SchedulePathParam {
  sid: string;
}

type ModifyScheduleParam = SchedulePathParam & {};
type DeleteScheduleParam = SchedulePathParam & {};

interface ModifyScheduleReq {
  tags?: number[];
  title?: string;
  description?: string;
  importance?: ScheduleImportanceType;
  color?: ColorType;
  start_date?: string; // ISO8601
  end_date?: string; // ISO8601
  is_repeat?: boolean;
  repeat_end_option?: RepeatEndOptionType;
  repeat_frequency?: RepeatFrequencyType;
  repeat_interval?: number;
  repeat_end_date?: string; // ISO8601
  repeat_end_count?: number;
}

interface ModifyRepeatScheduleReq extends ModifyScheduleReq {
  modify_type: ModifyOptionType;
  before_start_date: string; // ISO8601
  before_end_date: string; // ISO8601
}

interface DeleteScheduleReq {
  delete_type: DeleteOptionType;
}

interface CreateScheduleReq {
  tags: number[];
  title: string;
  description: string;
  importance: ScheduleImportanceType;
  color: ColorType;
  start_date: string; // ISO8601
  end_date: string; // ISO8601
  is_repeat: boolean;
  repeat_end_option?: RepeatEndOptionType;
  repeat_frequency?: RepeatFrequencyType | null;
  repeat_interval?: number | null;
  repeat_end_date?: string | null; // ISO8601
  repeat_end_count?: number | null;
}

interface LoginReq {
  id: string;
  password: string;
}

interface LoginRes {
  id: string;
  email: string;
}

interface SignupReq {
  id: string;
  email: string;
  password: string;
}

interface CheckIdReq {
  id: string;
}

interface CheckIdRes {
  available: boolean;
}

interface CheckEmailReq {
  email: string;
}

interface CheckEmailRes {
  available: boolean;
}

interface FindIdReq {
  email: string;
}

interface FindIdSuccessRes {
  success: true;
  id: string;
  created_at: string; // ISO8601 (YYYY-MM-DD)
}

interface FindIdFailureRes {
  success: false;
}

type FindIdRes = FindIdSuccessRes | FindIdFailureRes;

interface SendEmailCodeReq {
  email: string;
}

interface VerifyEmailCodeReq {
  email: string;
  code: string;
}

interface VerifyEmailCodeRes {
  success: boolean;
}

interface SendPwCodeReq {
  email: string;
}

interface SendPwCodeRes {
  success: boolean;
}

interface VerifyPwCodeReq {
  email: string;
  code: string;
}

interface VerifyPwCodeRes {
  success: boolean;
}

interface ResetPwReq {
  email: string;
  password: string;
}
