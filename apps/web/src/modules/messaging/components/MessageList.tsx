"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { useIntersectionObserver } from "usehooks-ts";
import type { GetMessagesResponse } from "@repo/contracts";

import { getErrorMessage } from "@/shared/api";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Spinner } from "@/shared/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

import { messageKeys, useMessages } from "../messaging.queries";
import type { MessageRole } from "../messaging.types";
import { MessageCard } from "./MessageCard";
import { MessageCardSkeleton } from "./MessageCardSkeleton";

const titles: Record<MessageRole, string> = {
  RECEIVER: "Messages I Received",
  SENDER: "Messages Sent By Me",
};

const MessageList = ({
  role,
  initialPage,
}: {
  role: MessageRole;
  initialPage: GetMessagesResponse | null;
}) => {
  const queryClient = useQueryClient();
  const { data, error, isPending, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMessages(role, initialPage);

  // loads the next page by itself when the "load more" area scrolls into view
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // starts over from the first page
  const refresh = () => queryClient.resetQueries({ queryKey: messageKeys.list(role) });

  const messages = data?.pages.flatMap((page) => page.messages) ?? [];

  return (
    <>
      <div className="flex gap-2 items-center mx-auto w-fit my-2">
        <h2 className="text-lg font-semibold">{titles[role]}</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={refresh}
              disabled={isFetching}
              aria-label="Refresh"
            >
              <RefreshCcw
                className={`h-4 w-4 ${isFetching && !isFetchingNextPage ? "animate-spin" : ""}`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh</TooltipContent>
        </Tooltip>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {isPending && Array.from({ length: 4 }).map((_, i) => <MessageCardSkeleton key={i} />)}
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} role={role} />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-destructive mt-4">{getErrorMessage(error)}</p>
      )}

      {!isPending && !error && messages.length === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-4">No messages yet.</p>
      )}

      <div ref={loadMoreRef} className="flex flex-col items-center">
        {hasNextPage && (
          <Button
            className="translate-y-[75%]"
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage && <Spinner />}
            {isFetchingNextPage ? "Loading" : "Load More"}
          </Button>
        )}
        <Separator className="mt-2" />
      </div>
    </>
  );
};

export { MessageList };
