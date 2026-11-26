"use client";

import type { GetMessagesResponse } from "@repo/contracts";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { MessageList } from "./MessageList";

const tabClassName =
  "p-4 data-[state=active]:bg-secondary dark:data-[state=active]:bg-secondary data-[state=active]:text-foreground rounded-4xl dark:text-background text-background";

// Only the open tab is mounted, so the sent messages are not requested until that tab is opened
const MessageInbox = ({ initialReceived }: { initialReceived: GetMessagesResponse | null }) => (
  <Tabs defaultValue="received" className="mt-6">
    <TabsList className="py-5 mx-auto bg-foreground dark:bg-foreground/80 rounded-4xl">
      <TabsTrigger value="received" className={tabClassName}>
        Received
      </TabsTrigger>
      <TabsTrigger value="sent" className={tabClassName}>
        Sent
      </TabsTrigger>
    </TabsList>

    <TabsContent value="received">
      <MessageList role="RECEIVER" initialPage={initialReceived} />
    </TabsContent>
    <TabsContent value="sent">
      <MessageList role="SENDER" initialPage={null} />
    </TabsContent>
  </Tabs>
);

export { MessageInbox };
