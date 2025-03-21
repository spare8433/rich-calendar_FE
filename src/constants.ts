export const SCHEDULE_VIEW_TYPE = {
  day: "timeGridDay",
  week: "timeGridWeek",
  month: "dayGridMonth",
} as const;

export const COLORS = [
  "pink",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "mint",
  "lavender",
  "beige",
  "coral",
] as const;

export const REPEAT_FREQUENCY = ["daily", "weekly", "monthly", "yearly"] as const;
export const REPEAT_FREQUENCY_TYPE = {
  weekly: "주",
  daily: "일",
  monthly: "월",
  yearly: "년",
} as const;

export const IMPORTANCE_TYPE = {
  veryLow: "매우 낮음",
  low: "낮음",
  medium: "보통",
  high: "중요",
  veryHigh: "매우 중요",
} as const;
export const IMPORTANCE = ["veryLow", "low", "medium", "high", "veryHigh"] as const;

export const INVALID_TYPE_ERROR = { message: "부적절한 값입니다." };

export const TERMS = `
개인정보 수집 및 이용 동의

본 서비스는 회원가입 및 서비스 제공을 위해 아래와 같이 개인정보를 수집 및 이용합니다. 동의를 거부하실 수 있으나, 동의하지 않으실 경우 회원가입이 제한될 수 있습니다.

1. 수집하는 개인정보 항목
필수항목: 아이디, 이메일, 비밀번호
선택항목: 없음

2. 개인정보의 수집 및 이용 목적
회원 가입 및 관리
서비스 제공 및 품질 개선
고객 문의 대응

3. 개인정보 보유 및 이용 기간
회원 탈퇴 시 즉시 파기 (법령에 따라 보존이 필요한 경우 해당 기간 보관)

4. 동의 여부
위 개인정보 수집 및 이용에 동의합니다.
`;

export const SERVICE = `
서비스 이용약관 동의

본 약관은 서비스 이용과 관련하여 서비스 제공자와 사용자 간의 권리, 의무, 책임사항 및 기타 필요한 사항을 규정합니다.

제1조 (목적)
이 약관은 서비스 이용과 관련된 서비스 제공자와 사용자 간의 권리, 의무 및 책임사항을 정하는 것을 목적으로 합니다.

제2조 (이용계약의 체결)
사용자는 약관에 동의함으로써 서비스 이용 계약을 체결합니다.
서비스 제공자는 사용자가 약관에 동의하고 필요한 정보를 제공하는 경우 서비스 이용을 승인합니다.

제3조 (사용자의 의무)
사용자는 관련 법령, 약관, 이용안내 등을 준수해야 합니다.
사용자는 타인의 정보를 도용하거나 허위 정보를 제공해서는 안 됩니다.

제4조 (서비스의 제공 및 변경)
서비스 제공자는 서비스를 안정적으로 제공하기 위해 최선을 다합니다.
서비스의 내용은 서비스 제공자의 사정에 따라 변경될 수 있으며, 변경 시 사전에 공지합니다.

제5조 (동의 여부)
위 이용약관에 동의합니다.
`;
