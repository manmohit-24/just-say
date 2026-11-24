import type { Metadata } from "next";

import { SessionRestore } from "@/modules/auth";
import { getCurrentUser } from "@/modules/auth/server";
import { MessageInbox } from "@/modules/messaging";
import { getInitialMessages } from "@/modules/messaging/server";
import { ProfileHeader } from "@/modules/user";
import { Separator } from "@/shared/components/ui/separator";

export const metadata: Metadata = { title: "Dashboard" };

const DashboardPage = async () => {
  const user = await getCurrentUser();

  // no session on the server: try to renew it in the browser before asking for a login
  if (!user) return <SessionRestore redirectTo="/dashboard" />;

  // the first page of received messages is loaded here, so it is part of the first render
  const initialReceived = await getInitialMessages("RECIEVER");

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <ProfileHeader user={user} />

      <Separator className="mt-6" />

      <MessageInbox initialReceived={initialReceived} />
    </>
  );
};

export default DashboardPage;
