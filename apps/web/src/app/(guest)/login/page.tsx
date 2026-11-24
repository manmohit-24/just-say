import type { Metadata } from "next";

import { LoginForm } from "@/modules/auth";
import { safeRedirect } from "@/shared/lib/safeRedirect";

export const metadata: Metadata = { title: "Login" };

const LoginPage = async ({ searchParams }: { searchParams: Promise<{ next?: string }> }) => {
  const { next } = await searchParams;

  return <LoginForm redirectTo={safeRedirect(next)} />;
};

export default LoginPage;
