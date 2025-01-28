import { http, HttpResponse } from "msw";

const API_URL = "api/auth";

export const AuthHandlers = [
  // 로그인
  http.post<never, LoginReq>(`${API_URL}/login`, () => {
    // 가짜 JWT 토큰 생성 (예제용)
    const mockJwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5kb2UiLCJpYXQiOjE2Mjk3OTc3NzYsImV4cCI6MTYyOTgwMTM3Nn0.rR1fLPC-bkCvpIJyO6y5xETrX6AcP5E7bnEVYmP5tDU";

    return new HttpResponse("ok", {
      headers: { "Set-Cookie": `authToken=${mockJwtToken}; Path=/; HttpOnly` },
    }).json();
  }),

  // 회원가입
  http.post<never, SignupReq>(`${API_URL}/signup`, () => {
    return HttpResponse.text("ok");
  }),

  // 중복 email 확인
  http.post<never, CheckEmailReq, CheckEmailRes>(`${API_URL}/email/check-email`, () => {
    return HttpResponse.json({ available: true });
  }),

  // 이메일 인증코드 발송
  http.post<never, SendEmailCodeReq>(`${API_URL}/email/send-code`, () => {
    return HttpResponse.text("ok");
  }),

  // 이메일 코드 인증
  http.post<never, VerifyEmailCodeReq, VerifyEmailCodeRes>(`${API_URL}/email/verify-code`, () => {
    return HttpResponse.json({ success: true });
  }),

  // 중복 username 확인
  http.post<never, CheckUsernameReq, CheckUsernameRes>(`${API_URL}/username/check-username`, () => {
    return HttpResponse.json({ available: true });
  }),

  // username 찾기
  http.post<never, FindUsernameReq, FindUsernameRes>(`${API_URL}/username/find-username`, () => {
    return HttpResponse.json({ success: true, username: "userid12332", createdAt: "2024-07-23" });
  }),

  // 비밀번호 인증코드 발송
  http.post<never, SendPwCodeReq>(`${API_URL}/password/send-code`, () => {
    return HttpResponse.text("ok");
  }),

  // 비밀번호 코드 인증
  http.post<never, VerifyPwCodeReq, VerifyPwCodeRes>(`${API_URL}/password/verify-code`, () => {
    return HttpResponse.json({ success: true });
  }),

  // 비밀번호 재설정
  http.patch<never, ResetPwReq>(`${API_URL}/password`, () => {
    return HttpResponse.text("ok");
  }),
];
