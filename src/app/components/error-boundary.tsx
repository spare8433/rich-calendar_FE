"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorInfo, type JSX } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

import { Button } from "@/app/components/ui/button";
import { CustomError } from "@/lib/customError";

// 통합 에러 핸들링 함수
const handleError = (error: CustomError, info: ErrorInfo) => {
  // 인증 오류 처리
  if (error.statusCode === 401) location.replace("/auth/login");
};

interface FallbackComponentProps {
  error: CustomError | null;
  resetErrorBoundary: () => void;
}

// 핸들링 되지 못해서 throw 받은 에러
function FallbackRender({ error, resetErrorBoundary }: FallbackComponentProps) {
  return (
    <div role="alert" className="flex size-full flex-col items-center justify-center">
      <p className="mb-2 text-lg font-bold">{error?.message ?? "정보를 불러오지 못했습니다."}</p>
      <p className="mb-4 font-medium">잠시 후 다시 시도해 주세요.</p>
      <Button type="button" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </div>
  );
}

type ErrorBoundaryProps = {
  children: React.ReactNode;
  FallbackComponent?: (props: FallbackComponentProps) => React.ReactNode;
};

export default function ErrorBoundary({ children, FallbackComponent }: ErrorBoundaryProps): JSX.Element {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ReactErrorBoundary
          onReset={reset}
          onError={handleError}
          FallbackComponent={(props) => (FallbackComponent ? FallbackComponent(props) : <FallbackRender {...props} />)}
        >
          {children}
        </ReactErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
