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

export const FREQUENCY = {
  daily: "day",
  weekly: "week",
  monthly: "month",
  yearly: "year",
} as const;

export const DUMMY_SCHEDULES: EntireSchedule[] = [
  {
    id: "f47c9a5e-2163-4a0b-80d8-6f125a8c9517",
    title: "Team Meeting",
    description: "Weekly team sync-up meeting",
    importance: "medium",
    color: "blue",
    startDate: "2024-12-26T09:00:00Z",
    endDate: "2024-12-26T10:00:00Z",
    isRepeat: true,
    repeatFrequency: "weekly",
    repeatInterval: 1,
    repeatEndCount: 5,
    repeatEndDate: "2025-01-30T10:00:00Z", // (5주 반복, 1월까지 종료)
    createdAt: "2024-12-20T12:00:00Z",
    tags: [{ id: "5a9f2642-c28e-4068-b9be-6bdf57b98b8f", title: "Work" }],
  },
  {
    id: "6c6d4f72-5447-47ff-9c5d-cbc1a9b1b7b0",
    title: "Yoga Class",
    description: "Daily yoga sessions for relaxation",
    importance: "high",
    color: "green",
    startDate: "2025-01-05T07:00:00Z",
    endDate: "2025-01-05T08:00:00Z",
    isRepeat: true,
    repeatFrequency: "daily",
    repeatInterval: 1,
    repeatEndCount: 10,
    repeatEndDate: "2025-01-15T08:00:00Z", // (10일 반복)
    createdAt: "2024-12-31T10:00:00Z",
    tags: [{ id: "02c3d7a6-739d-41b1-94b2-df8b9052e682", title: "Health" }],
  },
  {
    id: "d5f56bc6-4097-4d84-bb02-2b02fd77e3d9",
    title: "Doctor Appointment",
    description: "Routine check-up with the family doctor",
    importance: "high",
    color: "pink",
    startDate: "2025-01-15T14:00:00Z",
    endDate: "2025-01-15T15:00:00Z",
    isRepeat: false,
    repeatFrequency: null,
    repeatInterval: null,
    repeatEndCount: null,
    repeatEndDate: "2025-01-15T15:00:00Z",
    createdAt: "2024-12-20T18:00:00Z",
    tags: [{ id: "02c3d7a6-739d-41b1-94b2-df8b9052e682", title: "Health" }],
  },
  {
    id: "09a8b689-0f0f-41e4-a98f-0cd59ef3b6c6",
    title: "Monthly Book Club",
    description: "Discussing the book of the month",
    importance: "low",
    color: "lavender",
    startDate: "2024-12-20T18:00:00Z",
    endDate: "2024-12-20T20:00:00Z",
    isRepeat: true,
    repeatFrequency: "monthly",
    repeatInterval: 1,
    repeatEndCount: 2,
    repeatEndDate: "2025-02-20T20:00:00Z", // (2회 반복, 2월 종료)
    createdAt: "2024-12-10T14:00:00Z",
    tags: [{ id: "d6a03419-3c57-4634-975d-85b262a03d5c", title: "Leisure" }],
  },
  {
    id: "5b0e4f8e-e0f7-4020-a1b5-7ef9fe4777b4",
    title: "Annual Performance Review",
    description: "Yearly review meeting with the manager",
    importance: "veryHigh",
    color: "orange",
    startDate: "2025-02-01T10:00:00Z",
    endDate: "2025-02-01T12:00:00Z",
    isRepeat: true,
    repeatFrequency: "yearly",
    repeatInterval: 1,
    repeatEndCount: 1,
    repeatEndDate: "2025-02-01T12:00:00Z", // (1회 반복)
    createdAt: "2024-12-01T09:00:00Z",
    tags: [{ id: "5a9f2642-c28e-4068-b9be-6bdf57b98b8f", title: "Work" }],
  },
];

export const DUMMY_TAGS: Tag[] = [
  { id: "5a9f2642-c28e-4068-b9be-6bdf57b98b8f", title: "Work" },
  { id: "02c3d7a6-739d-41b1-94b2-df8b9052e682", title: "Health" },
  { id: "d6a03419-3c57-4634-975d-85b262a03d5c", title: "Leisure" },
  { id: "22ed0b25-6e2e-48ae-84be-9335e402b6fd", title: "Education" },
  { id: "db6a5b64-0730-47ea-b5a0-df56e7fe1ea4", title: "Family" },
  { id: "9f7809c5-1d1f-4ea9-bf4c-58c7a9f38ac7", title: "Personal" },
  { id: "c5d90ccf-8c43-4a9a-b039-b2f90053d90d", title: "Exercise" },
  { id: "3bc3ec9e-bd91-4a70-98ae-760fd2b58e1a", title: "Hobby" },
];

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
