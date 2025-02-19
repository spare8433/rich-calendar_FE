import dayjs, { ConfigType } from "dayjs";

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

/** 기존 날짜시간 에서 새로운 날짜의 년, 월, 일로 변경  */
export function modifyOnlyDate(prevDate: ConfigType, changedDate: ConfigType) {
  // 기존 시간 dayjs 객체로 변환
  const prevDayjs = dayjs(prevDate);

  // 새로운 Date 객체를 dayjs 객체로 변환하여 년월일 가져옴
  const changeDayjs = dayjs(changedDate);

  // 기존 시간의 시, 분, 초 유지하고 새로운 날짜의 년, 월, 일로 설정
  const finalDate = prevDayjs
    .year(changeDayjs.year()) // 새로운 날짜의 "년" 으로 변경
    .month(changeDayjs.month()) // 새로운 날짜의 "월" 로 변경
    .date(changeDayjs.date()); // 새로운 날짜의 "일" 로 변경

  return finalDate;
}

/**
 * 기존 날짜시간 에서 새로운 시간 시, 분, 초로 변경
 * @param prevDate 여러 형식의 기존 날짜 데이터
 * @param changeTime "HH:mm" 형식의 시간 데이터
 * @returns dayjs 객체
 */
export function modifyOnlyTime(prevDate: ConfigType, changedTime: string) {
  // 기존 시간 dayjs 객체로 변환
  const prevDayjs = dayjs(prevDate);

  // HH:mm 형식의 시간 데이터 분리
  const [hour, minute] = changedTime.split(":");

  // 기존 시간의 시, 분, 초 유지하고 새로운 날짜의 년, 월, 일로 설정
  const finalDate = prevDayjs
    .hour(Number(hour)) // 새로운 시간의 "시" 로 변경
    .minute(Number(minute)); // 새로운 시간의 "분" 으로 변경

  return finalDate;
}
