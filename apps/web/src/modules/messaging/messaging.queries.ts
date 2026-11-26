import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { GetMessagesResponse } from "@repo/contracts";

import { getErrorMessage } from "@/shared/api";

import { deleteMessageForUser, getMessages, sendMessage, unsendMessage } from "./api";
import type { MessageRole } from "./messaging.types";

type MessagePages = InfiniteData<GetMessagesResponse, string | undefined>;

const messageKeys = {
  all: ["messages"] as const,
  list: (role: MessageRole) => [...messageKeys.all, role] as const,
};

// The list of a role, loaded page by page. The first page can come from the server render.
const useMessages = (role: MessageRole, initialPage: GetMessagesResponse | null) =>
  useInfiniteQuery({
    queryKey: messageKeys.list(role),
    queryFn: ({ pageParam, signal }) =>
      getMessages({ role, ...(pageParam && { cursor: pageParam }) }, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    ...(initialPage && { initialData: { pages: [initialPage], pageParams: [undefined] } }),
  });

const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    // the message belongs in the "sent" list of the sender
    onSuccess: () => queryClient.invalidateQueries({ queryKey: messageKeys.list("SENDER") }),
  });
};

const removeFromCache = (queryClient: QueryClient, role: MessageRole, messageId: string) =>
  queryClient.setQueryData<MessagePages>(
    messageKeys.list(role),
    (data) =>
      data && {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          messages: page.messages.filter((message) => message.id !== messageId),
        })),
      }
  );

// Deleting for yourself and unsending end the same way in the UI: the message disappears.
const useRemoveMessage = (role: MessageRole, action: "delete" | "unsend") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: action === "delete" ? deleteMessageForUser : unsendMessage,
    onSuccess: (_data, messageId) => {
      toast.success(action === "delete" ? "Message deleted" : "Message unsent");
      removeFromCache(queryClient, role, messageId);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export { messageKeys, useMessages, useSendMessage, useRemoveMessage };
