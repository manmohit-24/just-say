import { BellDot, Check, CheckCheck } from "lucide-react";
import type { MessageListItem } from "@repo/contracts";

import { Badge } from "@/shared/components/ui/badge";

import type { MessageRole } from "../messaging.types";

const baseStyle = "px-2 py-1 text-[10px] font-bold uppercase";

// The same status reads differently to the sender and to the receiver
const MessageStatusBadge = ({
  status,
  role,
}: {
  status: MessageListItem["status"];
  role: MessageRole;
}) => {
  if (status === "READ") {
    return (
      <Badge className={`${baseStyle} bg-sky-500/15 text-sky-500`}>
        <CheckCheck /> Read
      </Badge>
    );
  }

  return (
    <Badge className={`${baseStyle} bg-purple-500/15 text-purple-500`}>
      {role === "SENDER" ? (
        <>
          <Check /> Sent
        </>
      ) : (
        <>
          <BellDot /> New
        </>
      )}
    </Badge>
  );
};

export { MessageStatusBadge };
