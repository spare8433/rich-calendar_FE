interface HttpReqRes<T_Req = unknown, T_Res = unknown> {
  req: T_Req;
  res: T_Res;
}

interface ApiEndpointInfo {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  withCredentials?: boolean;
}

// API Req, Res 타입 정의
export interface ApiEndpoint {
  getCalendarSchedules: HttpReqRes<GetSchedulesReq, GetSchedulesRes>;
  getScheduleTags: HttpReqRes<never, GetScheduleTagsRes>;
  getSchedule: HttpReqRes<never, GetScheduleRes>;
  getSummarySchedules: HttpReqRes<GetSummarySchedulesReq, GetSummarySchedulesRes>;
  modifyCalendarSchedule: HttpReqRes<ModifyCalendarScheduleReq, never>;
  updateSchedule: HttpReqRes<UpdateScheduleReq, never>;
  deleteSchedule: HttpReqRes<never, never>;
  createSchedule: HttpReqRes<CreateScheduleReq, never>;
  login: HttpReqRes<LoginReq, never>;
  signup: HttpReqRes<SignupReq, never>;
  checkUsername: HttpReqRes<CheckUsernameReq, CheckUsernameRes>;
  checkEmail: HttpReqRes<CheckEmailReq, CheckEmailRes>;
  findUsername: HttpReqRes<FindUsernameReq, FindUsernameRes>;
  sendEmailCode: HttpReqRes<SendEmailCodeReq, never>;
  verifyEmailCode: HttpReqRes<VerifyEmailCodeReq, VerifyEmailCodeRes>;
  sendPwCode: HttpReqRes<SendPwCodeReq, never>;
  verifyPwCode: HttpReqRes<VerifyPwCodeReq, VerifyPwCodeRes>;
  resetPw: HttpReqRes<ResetPwReq, never>;
  getMyInfo: HttpReqRes<never, LoginRes>;
  withdrawMember: HttpReqRes<never, never>;
}

// API Endpoint 정보
export const apiEndpoint: Record<keyof ApiEndpoint, ApiEndpointInfo> = {
  // schedules
  createSchedule: {
    url: "/api/schedules",
    method: "POST",
    withCredentials: true,
  },
  getSchedule: {
    url: "/api/schedules",
    method: "GET",
    withCredentials: true,
  },
  updateSchedule: {
    url: "/api/schedules",
    method: "PUT",
    withCredentials: true,
  },
  deleteSchedule: {
    url: "/api/schedules",
    method: "DELETE",
    withCredentials: true,
  },

  // calendars
  getCalendarSchedules: {
    url: "/api/schedules/calendars",
    method: "GET",
    withCredentials: true,
  },
  modifyCalendarSchedule: {
    url: "/api/schedules/calendars",
    method: "PATCH",
    withCredentials: true,
  },
  getScheduleTags: {
    url: "/api/schedules/tags",
    method: "GET",
    withCredentials: true,
  },
  getSummarySchedules: {
    url: "/api/schedules/summary",
    method: "GET",
    withCredentials: true,
  },

  // auth
  login: {
    url: "/api/auth/login",
    method: "POST",
    withCredentials: true,
  },
  signup: {
    url: "/api/auth/signup",
    method: "POST",
  },
  checkUsername: {
    url: "/api/auth/username/check-username",
    method: "POST",
  },
  findUsername: {
    url: "/api/auth/username/find-username",
    method: "POST",
  },
  checkEmail: {
    url: "/api/auth/email/check-email",
    method: "POST",
  },
  sendEmailCode: {
    url: "/api/auth/email/send-code",
    method: "POST",
  },
  verifyEmailCode: {
    url: "/api/auth/email/verify-code",
    method: "POST",
  },
  resetPw: {
    url: "/api/auth/password",
    method: "PATCH",
  },
  sendPwCode: {
    url: "/api/auth/password/send-code",
    method: "POST",
  },
  verifyPwCode: {
    url: "/api/auth/password/verify-code",
    method: "POST",
  },

  // users/me
  getMyInfo: {
    url: "/api/users/me",
    method: "GET",
    withCredentials: true,
  },
  withdrawMember: {
    url: "/api/users/me",
    method: "DELETE",
    withCredentials: true,
  },
};
