import type { Metadata } from "next";

import { SessionRestore } from "@/modules/auth";
import { getCurrentUser } from "@/modules/auth/server";
import { ProfileHeader } from "@/modules/user";

export const metadata: Metadata = { title: "Dashboard" };

const DashboardPage = async () => {
  const user = await getCurrentUser();

  // no session on the server: try to renew it in the browser before asking for a login
  if (!user) return <SessionRestore redirectTo="/dashboard" />;

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <ProfileHeader user={user} />
    </>
  );
};

export default DashboardPage;
