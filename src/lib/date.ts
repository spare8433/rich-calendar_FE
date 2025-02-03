import dayjs, { ConfigType } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function convertUstToKST(date: ConfigType) {
  return dayjs(date).local();
}

/**  기본 날짜 형식으로 변환하여 반환 (YYYY-MM-DDTHH:mm:SSS) */
export function getDefaultFormatDate(date: ConfigType) {
  return dayjs(date).format("YYYY-MM-DDTHH:mm:sssZ");
}

/** 입력받은 특정 날짜의 해당 월의 달력 기준 시작과 끝 날짜 반환 함수 */
export function getMonthDateRange(date: Date | string) {
  // 입력받은 특정 날짜
  const currentDate = dayjs(date);

  // 해당 월의 첫째 날
  const startOfMonth = currentDate.startOf("month");

  // 해당 월의 마지막 날
  const endOfMonth = currentDate.endOf("month");

  // 달력의 시작 날짜 (첫째 주 일요일)
  const calendarMothStartDate = startOfMonth.startOf("week").toISOString();

  // 달력의 마지막 날짜 (마지막 주 토요일)
  const calendarMothEndDate = endOfMonth.endOf("week").toISOString();

  return { startDate: calendarMothStartDate, endDate: calendarMothEndDate };
}

/** 입력받은 특정 날짜의 해당 주의 시작과 끝 날짜 반환 함수 */
export function getWeekDateRange(date: Date | string) {
  // 입력받은 특정 날짜
  const currentDate = dayjs(date);

  // 해당 주의 첫째 날
  const calendarWeekStartDate = currentDate.startOf("week").toISOString();

  // 해당 주의 마지막 날
  const calendarWeekEndDate = currentDate.endOf("week").toISOString();

  return { startDate: calendarWeekStartDate, endDate: calendarWeekEndDate };
}

/** 입력 받은 특정 날짜가 자정이라면 YYYY-MM-DD 형식으로 반환 (ex: 2024-06-10T00:00 -> 2024-06-10) */
export function changeDateIfMidnight(startDate: Date | string) {
  const dateTime = dayjs(startDate).local();

  if (dateTime.hour() === 0 && dateTime.minute() === 0) {
    // "YYYY-MM-DD" 형식으로 변경
    return dateTime.format("YYYY-MM-DD");
  }

  return startDate;
}

/** 입력된 두 날짜가 동일한지 여부 반환 */
export function areDatesEqual(date1: ConfigType, date2: ConfigType) {
  // dayjs 객체로 변환
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);

  return d1.isSame(d2);
}
