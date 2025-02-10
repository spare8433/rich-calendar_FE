import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import Providers from "@/app/components/providers";
import { Toaster } from "@/app/components/ui/toaster";
import { cn } from "@/lib/utils";

const pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/Pretendard-Regular.subset.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Medium.subset.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-SemiBold.subset.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Bold.subset.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Rich Calendar",
  description: "Rich Calendar 로 일정을 관리할 수 있습니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="size-full">
      <body className={cn(pretendard.className, "size-full antialiased")}>
        {/* mock server */}
        <Toaster />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
