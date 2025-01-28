import { http, HttpResponse } from "msw";

const API_URL = "api/schedules";

export const ScheduleHandlers = [
  //개인 일정(개인 일정 + 본인 참가 그룹 일정) 목록 조회
  http.get<never, GetSchedulesReq, GetSchedulesRes>(API_URL, () => {
    return HttpResponse.json({
      schedules: [
        {
          id: 1234,
          title: "Weekly Team Meeting",
          color: "pink",
          startDate: "2024-10-10T00:00:00Z",
          endDate: "2024-10-13T00:00:00Z",
          isRepeat: false,
        },
        {
          id: 234,
          title: "Gym Session",
          color: "yellow",
          startDate: "2024-10-12T18:00:00Z",
          endDate: "2024-10-12T19:00:00Z",
          isRepeat: true,
          repeatFrequency: "weekly",
          repeatInterval: 1,
          repeatEndCount: 3,
        },
        {
          id: 24,
          title: "Team Lunch",
          color: "green",
          startDate: "2024-10-08T12:00:00Z",
          endDate: "2024-10-09T13:00:00Z",
          isRepeat: false,
        },
      ],
    });
  }),

  // 개인 일정 생성
  http.post<never, CreateScheduleReq>(API_URL, () => {
    return HttpResponse.text("ok");
  }),

  //개인 일정(개인 일정 + 본인 참가 그룹 일정) 디테일 조회
  http.get<GetScheduleParam, never, GetScheduleRes>(`${API_URL}/:sid`, ({ params }) => {
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
      startDate: "2024-05-10T10:00:00Z",
      endDate: "2024-05-10T12:00:00Z",
      isRepeat: true,
      repeatFrequency: "weekly",
      repeatInterval: 1,
      repeatEndCount: 1,
    });
  }),

  // 개인 일정 수정
  http.patch<ModifyScheduleParam, ModifyScheduleReq>(`${API_URL}/:sid`, () => {
    return HttpResponse.text("ok");
  }),

  // 개인 일정 삭제
  http.delete<DeleteScheduleParam>(`${API_URL}/:sid`, () => {
    return HttpResponse.text("ok");
  }),

  // 개인 일정 필터링 내용 조회 (개인 일정 태그 목록 + 그룹 목록 및 각 그룹별 태그 목록)
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
];
