import type { ReactNode } from "react";

import { AuthCard } from "@/modules/auth";
import { redirectIfAuthenticated } from "@/modules/auth/server";

// login, register and forgot password are only for visitors who are not logged in
const GuestLayout = async ({ children }: { children: ReactNode }) => {
  await redirectIfAuthenticated();

  return <AuthCard>{children}</AuthCard>;
};

export default GuestLayout;
