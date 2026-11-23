"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { refreshSession } from "@/shared/api";
import { Spinner } from "@/shared/components/ui/spinner";

// The access cookie expires after a few minutes, but the refresh cookie lasts much longer and
// only the browser can send it to the API. So when a protected page finds no session on the
// server, this tries to renew it first, and only then sends the visitor to the login page.
const SessionRestore = ({ redirectTo }: { redirectTo: string }) => {
  const router = useRouter();

  useEffect(() => {
    refreshSession().then((restored) => {
      if (restored) {
        // renders the page again, now with the new session
        router.refresh();
        return;
      }

      toast.warning("Please log in to continue", { id: "login-required" });
      router.replace(`/login?next=${encodeURIComponent(redirectTo)}`);
    });
  }, [redirectTo, router]);

  return (
    <div className="flex justify-center py-24">
      <Spinner className="size-8 opacity-30" />
    </div>
  );
};

export { SessionRestore };
