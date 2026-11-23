import type { Metadata } from "next";

import { SessionRestore } from "@/modules/auth";
import { getCurrentUser } from "@/modules/auth/server";

export const metadata: Metadata = { title: "Dashboard" };

// placeholder until the dashboard is migrated: it shows the protected page flow
const DashboardPage = async () => {
  const user = await getCurrentUser();

  // no session on the server: try to renew it in the browser before asking for a login
  if (!user) return <SessionRestore redirectTo="/dashboard" />;

  return (
    <div className="mx-auto p-6 w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <p>Welcome, {user.name}</p>
    </div>
  );
};

export default DashboardPage;
