import axios from "axios";

import { ApiEndpoint, apiEndpoint } from "@/lib/api-dict";
import { CustomError } from "@/lib/customError";

const api = (function () {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    timeout: 10000,
  });

  return instance;
})();

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error) && error.response) {
    // 서버가 응답을 반환한 경우
    switch (error.response.status) {
      case 400:
        throw new CustomError("요청에 문제가 있습니다.");
      case 401:
        throw new CustomError("인증이 필요합니다.", 401);
      case 403:
        throw new CustomError("접근이 금지되었습니다.", 403);
      case 404:
        throw new CustomError("요청한 자원을 찾을 수 없습니다.", 404);
      case 500:
        throw new CustomError("서버에 문제가 발생했습니다.", 500);
      case 502:
        throw new CustomError("잘못된 게이트웨이입니다.", 502);
      case 503:
        throw new CustomError("서비스를 사용할 수 없습니다.", 503);
      case 504:
        throw new CustomError("게이트웨이 시간 초과입니다.", 504);
      default:
        throw new CustomError("알 수 없는 에러가 발생했습니다.");
    }
  } else {
    // 요청을 설정하는 동안 문제가 발생한 경우
    throw new CustomError("요청 설정에 문제가 발생했습니다. ");
  }
};

const apiRequest = async <T_Key extends keyof ApiEndpoint>(
  key: T_Key,
  req?: ApiEndpoint[T_Key]["req"],
  pathParam?: string, // path param
): Promise<ApiEndpoint[T_Key]["res"]> => {
  const { url, method, withCredentials } = apiEndpoint[key];

  try {
    const res = await api.request({
      method,
      url: pathParam ? `${url}/${pathParam}` : url,
      data: method !== "GET" ? req : undefined, // request body
      withCredentials: withCredentials ?? false,
      params: method === "GET" || method === "DELETE" ? req : undefined, // query parameter
    });

    if (!res.data) throw new CustomError("데이터를 불러오지 못했습니다.");

    return res.data;
  } catch (error) {
    handleApiError(error);
    throw Error;
  }
};

export default apiRequest;
