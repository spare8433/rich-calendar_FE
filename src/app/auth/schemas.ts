import { z } from "zod";

const SEND_CODE_SCHEMA = z.object({ email: z.string().email("유효한 email 주소를 입력해주세요.") });
const VERIFY_CODE_SCHEMA = z.object({
  code: z.string().length(6, "인증코드는 6자 입니다."),
});

type SendCodeFormValues = z.infer<typeof SEND_CODE_SCHEMA>;
type VerifyCodeFormValues = z.infer<typeof VERIFY_CODE_SCHEMA>;

export { SEND_CODE_SCHEMA, type SendCodeFormValues, VERIFY_CODE_SCHEMA, type VerifyCodeFormValues };
