import type { ReactNode } from "react";

const AuthCard = ({ children }: { children: ReactNode }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md">{children}</div>
  </div>
);

export { AuthCard };
