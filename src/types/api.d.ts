interface GetSchedulesReq {
  startDate: string; // ISO8601
  endDate: string; // ISO8601
  tagIds?: number[];
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
  startDate: string; // ISO8601
  endDate: string; // ISO8601
  isRepeat: boolean;
  repeatFrequency: RepeatFrequencyType;
  repeatInterval: number;
  repeatEndOption?: "count" | "endDate" | "none";
  repeatEndDate?: string | null; // ISO8601
  repeatEndCount?: number | null;
}

interface GetScheduleTagsRes {
  tags: Tag[];
}

interface GetSummarySchedulesReq {
  selectedDate: string; // ISO8601 (YYYY-MM-DD)
  tagIds?: number[];
}

interface GetSummarySchedulesRes {
  summarySchedules: SummarySchedule[];
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
  startDate?: string; // ISO8601
  endDate?: string; // ISO8601
  isRepeat?: boolean;
  repeatEndOption?: RepeatEndOptionType;
  repeatFrequency?: RepeatFrequencyType;
  repeatInterval?: number;
  repeatEndDate?: string; // ISO8601
  repeatEndCount?: number;
}

interface ModifyRepeatScheduleReq extends ModifyScheduleReq {
  modifyType: ModifyOptionType;
  beforeStartDate: string; // ISO8601
  beforeEndDate: string; // ISO8601
}

interface DeleteScheduleReq {
  deleteType: DeleteOptionType;
}

interface CreateScheduleReq {
  tagIds: number[];
  title: string;
  description: string;
  importance: ScheduleImportanceType;
  color: ColorType;
  startDate: string; // ISO8601
  endDate: string; // ISO8601
  isRepeat: boolean;
  repeatEndOption?: RepeatEndOptionType;
  repeatFrequency?: RepeatFrequencyType | null;
  repeatInterval?: number | null;
  repeatEndDate?: string | null; // ISO8601
  repeatEndCount?: number | null;
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
  createdAt: string; // ISO8601 (YYYY-MM-DD)
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
