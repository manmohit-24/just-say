"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Clock, MoreVertical, Trash2, Undo2 } from "lucide-react";
import type { MessageListItem } from "@repo/contracts";

import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { useRemoveMessage } from "../messaging.queries";
import type { MessageRole } from "../messaging.types";
import { MessageStatusBadge } from "./MessageStatusBadge";

type Dialog = "delete" | "unsend" | null;

const MessageCard = ({ message, role }: { message: MessageListItem; role: MessageRole }) => {
  const [dialog, setDialog] = useState<Dialog>(null);
  const { mutate: deleteMessage } = useRemoveMessage(role, "delete");
  const { mutate: unsend } = useRemoveMessage(role, "unsend");

  // the other person in the conversation; a hidden sender (anonymous message) is missing
  const counterpart = role === "SENDER" ? message.receiver : message.sender;
  const name = counterpart?.name ?? "Anonymous";
  const createdDate = new Date(message.createdAt);

  const closeDialog = () => setDialog(null);

  return (
    <>
      <Card className="w-full max-w-2xl hover:shadow-md transition-shadow gap-0">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-foreground rounded-full flex items-center justify-center">
                <AvatarFallback className="text-background font-bold bg-transparent">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base font-semibold">{name}</CardTitle>
                {counterpart && (
                  <CardDescription className="text-xs">@{counterpart.username}</CardDescription>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MessageStatusBadge status={message.status} role={role} />

              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Message actions"
                  className="focus:outline-none hover:bg-gray-100 rounded-full p-1 transition-colors"
                >
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {role === "SENDER" && (
                    <DropdownMenuItem
                      onClick={() => setDialog("unsend")}
                      className="cursor-pointer text-orange-600"
                    >
                      <Undo2 className="mr-2 h-4 w-4" />
                      <span>Unsend Message</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => setDialog("delete")}
                    className="cursor-pointer text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete For Me</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-secondary-foreground mb-3">{message.content}</p>

          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
            <Clock className="h-3 w-3" />
            {/* the relative time can differ between the server render and the browser */}
            <time dateTime={createdDate.toDateString()} suppressHydrationWarning>
              {formatDistanceToNow(createdDate, { addSuffix: true })}
            </time>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={dialog === "delete"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Delete this message?"
        description={
          <>
            This action cannot be undone. This will permanently delete the message from your view.
            {role === "SENDER" && " The receiver will still be able to see it."}
          </>
        }
        confirmLabel="Delete"
        confirmClassName="bg-red-600 hover:bg-red-700"
        onConfirm={() => deleteMessage(message.id, { onSettled: closeDialog })}
      />

      <ConfirmDialog
        open={dialog === "unsend"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Unsend this message?"
        description="This will remove the message for both you and the recipient. This action cannot be undone."
        confirmLabel="Unsend"
        confirmClassName="bg-orange-600 hover:bg-orange-700"
        onConfirm={() => unsend(message.id, { onSettled: closeDialog })}
      />
    </>
  );
};

export { MessageCard };
