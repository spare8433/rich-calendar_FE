import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/schedules", req.url));
  }

  return NextResponse.next(); // 인증 통과
}

// 보호해야 할 경로 설정
export const config = {
  matcher: "/((?!auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)", // 제외 경로 정규식
};
