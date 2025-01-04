import { http, HttpResponse } from "msw";

const API_URL = "api/users";

export const UserHandlers = [
  // 로그인
  http.get<never, never, LoginRes>(`${API_URL}/me`, () => {
    return HttpResponse.json({
      id: "user3356",
      email: "yiccfee@naver.com",
    });
  }),

  // 회원탈퇴
  http.delete<never, never, string>(`${API_URL}/me`, () => {
    return HttpResponse.text("ok");
  }),
];
