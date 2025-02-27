import { z } from "zod";

const sendCodeSchema = z.object({ email: z.string().email("유효한 email 주소를 입력해주세요.") });
const verifyCodeSchema = z.object({
  code: z.string().length(6, "인증코드는 6자 입니다."),
});

type SendCodeFormValues = z.infer<typeof sendCodeSchema>;
type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;

export { type SendCodeFormValues, sendCodeSchema, type VerifyCodeFormValues, verifyCodeSchema };
