import type { ReactNode } from "react";

import { AuthCard } from "@/modules/auth";

// pages opened from links in emails: they work whether or not the visitor is logged in
const AccountLayout = ({ children }: { children: ReactNode }) => <AuthCard>{children}</AuthCard>;

export default AccountLayout;
