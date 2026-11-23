import { useQuery } from "@tanstack/react-query";
import { isUsernameAvailableSchema } from "@repo/contracts";
import { useDebounceValue } from "usehooks-ts";

import { isUsernameAvailable } from "./api";

const DEBOUNCE_MS = 500;

type UsernameAvailability = "idle" | "checking" | "available" | "taken" | "error";

// Asks the API whether a username is free, once the user stops typing.
// Invalid usernames (the form already shows why) and the current one are not checked.
const useUsernameAvailability = (username: string, currentUsername?: string) => {
  const [debounced] = useDebounceValue(username, DEBOUNCE_MS);

  const parsed = isUsernameAvailableSchema.shape.username.safeParse(debounced);
  const checked = parsed.success && parsed.data !== currentUsername ? parsed.data : null;

  const { data, isFetching, isError } = useQuery({
    queryKey: ["username-available", checked],
    queryFn: ({ signal }) => isUsernameAvailable(checked ?? "", signal),
    enabled: checked !== null,
    retry: false,
  });

  let status: UsernameAvailability = "idle";

  if (checked !== null) {
    // the debounced value lags behind while the user is still typing
    if (debounced !== username || isFetching) status = "checking";
    else if (isError) status = "error";
    else status = data?.available ? "available" : "taken";
  }

  return status;
};

export { useUsernameAvailability };
