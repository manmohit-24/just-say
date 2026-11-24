"use client";

import { FieldDescription } from "@/shared/components/ui/field";
import { Spinner } from "@/shared/components/ui/spinner";

import { useUsernameAvailability } from "../user.queries";

const messages = {
  available: "Username is available",
  taken: "Username is already taken",
  error: "Couldn't check the username right now",
};

const UsernameAvailabilityHint = ({
  username,
  currentUsername,
}: {
  username: string;
  currentUsername?: string;
}) => {
  const status = useUsernameAvailability(username, currentUsername);

  if (status === "idle") return null;
  if (status === "checking") return <Spinner />;

  return (
    <FieldDescription
      className={status === "available" ? "text-muted-foreground" : "text-destructive"}
    >
      {messages[status]}
    </FieldDescription>
  );
};

export { UsernameAvailabilityHint };
