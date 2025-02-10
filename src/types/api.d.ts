interface GetSchedulesReq {
  startDate: string; // ISO8601
  endDate: string; // ISO8601
  tagIds?: number[];
}

interface GetSchedulesRes {
  schedules: CalendarSchedule[];
}

interface GetScheduleParam {
  sid: string;
}

interface BasicScheduleDetail {
  id: number;
  title: string;
  description?: string;
  importance: ScheduleImportanceType;
  color: ColorType;
  tags: Tag[];
  startDate: string; // ISO8601
  endDate: string; // ISO8601
}

type RepeatScheduleDetail = BasicScheduleDetail & {
  isRepeat: true;
  repeatFrequency: RepeatFrequencyType;
  repeatInterval: number;
  repeatEndCount: number;
};

type NoRepeatScheduleDetail = BasicScheduleDetail & {
  isRepeat: false;
  repeatFrequency: null;
  repeatInterval: null;
  repeatEndCount: null;
};

type GetScheduleRes = RepeatScheduleDetail | NoRepeatScheduleDetail;

interface GetScheduleTagsRes {
  tags: Tag[];
}

interface SchedulePathParam {
  sid: string;
}

type UpdateScheduleParam = SchedulePathParam & {};
type DeleteScheduleParam = SchedulePathParam & {};

interface ModifyCalendarScheduleReq {
  beforeStartAt: string;
  beforeEndAt: string;
  startAt: string;
  endAt: string;
  isRepeat: boolean;
}

interface UpdateScheduleReq {
  tagIds: number[];
  title: string;
  description: string;
  importance: ScheduleImportanceType;
  color: ColorType;
  startDate: string; // ISO8601
  endDate: string; // ISO8601
  isRepeat: boolean;
  repeatFrequency: RepeatFrequencyType | null;
  repeatInterval: number | null;
  repeatEndCount: number | null;
}

interface BasicCreateScheduleReq {
  tagIds: number[];
  title: string;
  description: string;
  importance: ScheduleImportanceType;
  color: ColorType;
  startDate: string; // ISO8601
  endDate: string; // ISO8601
}

interface GetSummarySchedulesReq {
  startDate: string; // ISO8601
  endDate: string; // ISO8601
}

interface GetSummarySchedulesRes {
  schedules: SummarySchedule[];
}

type CreateRepeatScheduleReq = BasicCreateScheduleReq & {
  isRepeat: true;
  repeatFrequency: RepeatFrequencyType;
  repeatInterval: number;
  repeatEndCount: number;
};

type CreateNoRepeatScheduleReq = BasicCreateScheduleReq & {
  isRepeat: false;
  repeatFrequency: null;
  repeatInterval: null;
  repeatEndCount: null;
};

type CreateScheduleReq = CreateRepeatScheduleReq | CreateNoRepeatScheduleReq;

interface LoginReq {
  username: string;
  password: string;
}

interface LoginRes {
  username: string;
  email: string;
}

interface SignupReq {
  username: string;
  email: string;
  password: string;
}

interface CheckUsernameReq {
  username: string;
}

interface CheckUsernameRes {
  available: boolean;
}

interface CheckEmailReq {
  email: string;
}

interface CheckEmailRes {
  available: boolean;
}

interface FindUsernameReq {
  email: string;
}

interface FindUsernameSuccessRes {
  success: true;
  username: string;
  createdAt: string; // ISO8601 (YYYY-MM-DD)
}

interface FindUsernameFailureRes {
  success: false;
}

type FindUsernameRes = FindUsernameSuccessRes | FindUsernameFailureRes;

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

interface GetMyInfoRes {
  username: string;
  email: string;
}
