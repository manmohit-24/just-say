import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/modules/auth";

export const metadata: Metadata = { title: "Reset Password" };

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) => {
  const { token } = await searchParams;

  if (!token) redirect("/");

  return <ResetPasswordForm token={token} />;
};

export default ResetPasswordPage;
