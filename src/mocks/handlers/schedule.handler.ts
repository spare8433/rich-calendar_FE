import { http, HttpResponse } from "msw";

const API_URL = "api/schedules";

export const ScheduleHandlers = [
  // 개인 일정 생성
  http.post<never, CreateScheduleReq>(API_URL, () => {
    return HttpResponse.text("ok");
  }),

  //개인 일정 디테일 조회
  http.get<SchedulePathParam, never, GetScheduleRes>(`${API_URL}/:sid`, ({ params }) => {
    return HttpResponse.json({
      id: Number(params.sid),
      title: "Meeting with Client",
      description: "Discuss project details and deadlines",
      importance: "high",
      color: "pink",
      tags: [
        { id: 11, title: "Client" },
        { id: 22, title: "Meeting" },
      ],
      startDate: "2025-02-10T10:00:000Z",
      endDate: "2025-02-10T12:00:000Z",
      isRepeat: true,
      repeatFrequency: "weekly",
      repeatInterval: 1,
      repeatEndCount: 1,
    });
  }),

  // 개인 일정 업데이트
  http.put<SchedulePathParam, UpdateScheduleReq, never>(`${API_URL}/:sid`, ({ params }) => {
    return HttpResponse.text("ok");
  }),

  // 개인 일정 삭제
  http.delete<SchedulePathParam>(`${API_URL}/:sid`, () => {
    return HttpResponse.text("ok");
  }),

  //개인 일정 목록 조회
  http.get<never, GetSchedulesReq, GetSchedulesRes>(`${API_URL}/calendars`, () => {
    return HttpResponse.json({
      schedules: [
        {
          id: 1234,
          title: "Weekly Team Meeting",
          color: "pink",
          startAt: "2025-02-10T00:00:000Z",
          endAt: "2025-02-13T00:00:000Z",
          isRepeat: false,
        },
        {
          id: 234,
          title: "Gym Session",
          color: "yellow",
          startAt: "2025-02-12T18:00:000Z",
          endAt: "2025-02-12T19:00:000Z",
          isRepeat: true,
        },
        {
          id: 24,
          title: "Team Lunch",
          color: "green",
          startAt: "2025-02-08T12:00:00Z",
          endAt: "2025-02-09T13:00:00Z",
          isRepeat: false,
        },
      ],
    });
  }),

  // 개인 일정 수정
  http.patch<SchedulePathParam, ModifyCalendarScheduleReq>(`${API_URL}/calendars/:sid`, () => {
    return HttpResponse.text("ok");
  }),

  // 날짜별 요약된 일정 목록 조회
  http.get<never, GetSummarySchedulesReq, GetSummarySchedulesRes>(`${API_URL}/summary`, () => {
    return HttpResponse.json({
      schedules: [
        {
          id: 1234,
          title: "Weekly Team Meeting",
          color: "pink",
          startAt: "2025-02-10T00:00:00Z",
          endAt: "2025-02-13T00:00:00Z",
          tagTitles: ["Meeting"],
        },
        {
          id: 234,
          title: "Gym Session",
          color: "yellow",
          startAt: "2025-02-12T18:00:00Z",
          endAt: "2025-02-12T19:00:00Z",
          tagTitles: ["헬스"],
        },
        {
          id: 24,
          title: "Team Lunch",
          color: "green",
          startAt: "2025-02-08T12:00:00Z",
          endAt: "2025-02-09T13:00:00Z",
          tagTitles: ["Client", "Meeting"],
        },
      ],
    });
  }),

  // 개인 일정 태그 생성
  http.post<never, CreateScheduleTagReq>(API_URL, () => {
    return HttpResponse.text("ok");
  }),

  // 개인 일정 태그 목록 조회
  http.get<never, never, GetScheduleTagsRes>(`${API_URL}/tags`, () => {
    return HttpResponse.json({
      tags: [
        { id: 1, title: "헬스" },
        { id: 2, title: "여행" },
        { id: 11, title: "Client" },
        { id: 22, title: "Meeting" },
      ],
    });
  }),

  // 개인 일정 태그 업데이트
  http.put<SchedulePathParam, UpdateScheduleTagReq>(API_URL, () => {
    return HttpResponse.text("ok");
  }),

  // 개인 일정 태그 업데이트
  http.delete<SchedulePathParam, never>(API_URL, () => {
    return HttpResponse.text("ok");
  }),
];
