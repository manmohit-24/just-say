import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { UpdateEmailForm } from "@/modules/user";

export const metadata: Metadata = { title: "Change Email" };

const UpdateEmailPage = async ({ searchParams }: { searchParams: Promise<{ token?: string }> }) => {
  const { token } = await searchParams;

  if (!token) redirect("/");

  return <UpdateEmailForm token={token} />;
};

export default UpdateEmailPage;
