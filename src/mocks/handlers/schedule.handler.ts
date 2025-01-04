import { http, HttpResponse } from "msw";

const API_URL = "api/schedule";

export const ScheduleHandlers = [
  //개인 일정(개인 일정 + 본인 참가 그룹 일정) 목록 조회
  http.get<never, GetSchedulesReq, GetSchedulesRes>(`${API_URL}/list`, () => {
    return HttpResponse.json({
      schedules: [
        {
          id: 1234,
          title: "Weekly Team Meeting",
          color: "pink",
          dates: [
            {
              start_date: "2024-10-10T00:00:00",
              end_date: "2024-10-13T00:00:00",
            },
          ],
        },
        {
          id: 234,
          title: "Gym Session",
          color: "yellow",
          dates: [
            {
              start_date: "2024-10-12T18:00:00",
              end_date: "2024-10-12T19:00:00",
            },
          ],
        },
        {
          id: 24,
          title: "Team Lunch",
          color: "green",
          dates: [
            {
              start_date: "2024-10-08T12:00:00",
              end_date: "2024-10-09T13:00:00",
            },
            {
              start_date: "2024-10-15T00:00:00",
              end_date: "2024-10-18T00:00:00",
            },
          ],
        },
      ],
    });
  }),

  // 개인 일정 필터링 내용 조회 (개인 일정 태그 목록 + 그룹 목록 및 각 그룹별 태그 목록)
  http.get<never, never, GetScheduleTagsRes>(`${API_URL}/total-tags`, () => {
    return HttpResponse.json({
      schedule_tags: [
        { id: 1, name: "헬스" },
        { id: 2, name: "여행" },
        { id: 11, name: "Client" },
        { id: 22, name: "Meeting" },
      ],
    });
  }),

  // 일자별로 요약된 개인 일정 목록과 다가올 일정 목록 조회
  http.get<never, GetSummarySchedulesReq, GetSummarySchedulesRes>(`${API_URL}/summary-list`, () => {
    return HttpResponse.json({
      side_schedules: [
        {
          start_date: "2024-07-01",
          schedules: [
            {
              id: 1,
              end_date: "2024-07-12",
              title: "Team Meeting",
              color: "pink",
              tag_names: ["study", "develop"],
            },
          ],
        },
        {
          start_date: "2024-07-15",
          schedules: [
            {
              id: 2,
              end_date: "2024-07-15",
              title: "Lunch with Team",
              color: "yellow",
              tag_names: [],
            },
            {
              id: 3,
              end_date: "2024-07-16",
              title: "Project Review",
              color: "green",
              tag_names: ["project", "develop"],
            },
          ],
        },
      ],
    });
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
        { id: 11, name: "Client" },
        { id: 22, name: "Meeting" },
      ],
      start_date: "2024-05-10T10:00:00",
      end_date: "2024-05-10T12:00:00",
      is_repeat: true,
      repeat_end_option: "count",
      repeat_frequency: "weekly",
      repeat_interval: 1,
      repeat_end_count: 1,
      repeat_endDate: null, 
    });
  }),

  // 개인 반복 일정 수정
  http.patch<ModifyScheduleParam, ModifyRepeatScheduleReq, string>(`${API_URL}/repeat/:sid`, () => {
    return HttpResponse.text("ok");
  }),

  // 개인 일정 수정
  http.patch<ModifyScheduleParam, ModifyScheduleReq, string>(`${API_URL}/:sid`, () => {
    return HttpResponse.text("ok");
  }),

  // 개인 일정 생성
  http.post<never, CreateScheduleReq, string>(API_URL, () => {
    return HttpResponse.text("ok");
  }),

  // 개인 일정 삭제
  http.delete<DeleteScheduleParam, DeleteScheduleReq, string>(`${API_URL}/:sid`, () => {
    return HttpResponse.text("ok");
  }),
];

