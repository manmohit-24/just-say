import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { VerifyEmailStatus } from "@/modules/auth";

export const metadata: Metadata = { title: "Verify Email" };

const VerifyEmailPage = async ({ searchParams }: { searchParams: Promise<{ token?: string }> }) => {
  const { token } = await searchParams;

  if (!token) redirect("/");

  return <VerifyEmailStatus token={token} />;
};

export default VerifyEmailPage;
