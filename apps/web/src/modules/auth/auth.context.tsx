"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { GetUserResponse } from "@repo/contracts";

// undefined = no provider, null = nobody is logged in
const AuthContext = createContext<GetUserResponse | null | undefined>(undefined);

// The user is loaded on the server (see getCurrentUser) and handed down from the root layout.
// After logging in or out, router.refresh() reloads the layout and this value follows.
const AuthProvider = ({
  user,
  children,
}: {
  user: GetUserResponse | null;
  children: ReactNode;
}) => <AuthContext value={user}>{children}</AuthContext>;

const useCurrentUser = () => {
  const user = useContext(AuthContext);

  if (user === undefined) throw new Error("useCurrentUser must be used inside <AuthProvider>");

  return user;
};

export { AuthProvider, useCurrentUser };
