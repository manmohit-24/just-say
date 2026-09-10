import { z } from "zod";

const verifyEmailChangeSchema = z.object({
  challengeId: z.string().min(1),
  otp: z.string().length(8),
});

type VerifyEmailChangeDto = z.infer<typeof verifyEmailChangeSchema>;

export { verifyEmailChangeSchema };
export type { VerifyEmailChangeDto };
