import type { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto p-6 bg-background rounded w-full max-w-6xl">{children}</div>
);

export default AppLayout;
