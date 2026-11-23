"use client";

import Link from "next/link";
import { CircleAlert, CircleCheck } from "lucide-react";

import { getErrorMessage } from "@/shared/api";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

import { useVerifyEmail } from "../auth.queries";
import { AuthHeader } from "./AuthHeader";

// Target of the link in the verification email: the token is redeemed as soon as the page opens.
const VerifyEmailStatus = ({ token }: { token: string }) => {
  const { isPending, isError, error } = useVerifyEmail(token);

  if (isPending) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Spinner className="size-8" />
        <p>Verifying your email…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {isError ? (
        <CircleAlert className="size-12 text-destructive" />
      ) : (
        <CircleCheck className="size-12 text-green-500" />
      )}

      <AuthHeader
        title={isError ? "Verification failed" : "Email verified"}
        description={
          isError
            ? getErrorMessage(error)
            : "Your account is active now. You can log in and start receiving messages."
        }
      />

      <Button asChild className="w-full">
        <Link href={isError ? "/register" : "/login"}>
          {isError ? "Back to Register" : "Login"}
        </Link>
      </Button>
    </div>
  );
};

export { VerifyEmailStatus };
