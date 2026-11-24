"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck } from "lucide-react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Controller, useForm } from "react-hook-form";
import {
  authorizeEmailChangeSchema,
  verifyEmailChangeSchema,
  type AuthorizeEmailChangeDto,
  type VerifyEmailChangeDto,
} from "@repo/contracts";

import { AuthHeader } from "@/modules/auth";
import { TextField } from "@/shared/components/form/TextField";
import { Button } from "@/shared/components/ui/button";
import { FieldError, FieldGroup } from "@/shared/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/ui/input-otp";
import { Spinner } from "@/shared/components/ui/spinner";
import { setFormError } from "@/shared/lib/form";

import { useAuthorizeEmailChange, useVerifyEmailChange } from "../user.queries";

const OTP_LENGTH = 8;

type Step =
  | { name: "authorize" }
  | { name: "verify"; challengeId: string; newEmail: string }
  | { name: "done" };

// Target of the link in the "change email" email: first the password and the new address are
// confirmed, then the code that was sent to the new address.
const UpdateEmailForm = ({ token }: { token: string }) => {
  const [step, setStep] = useState<Step>({ name: "authorize" });

  if (step.name === "authorize") {
    return (
      <AuthorizeStep
        token={token}
        onAuthorized={(challengeId, newEmail) => setStep({ name: "verify", challengeId, newEmail })}
      />
    );
  }

  if (step.name === "verify") {
    return (
      <VerifyStep
        challengeId={step.challengeId}
        newEmail={step.newEmail}
        onVerified={() => setStep({ name: "done" })}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <CircleCheck className="size-12 text-green-500" />
      <AuthHeader
        title="Email changed"
        description="Your email address has been changed successfully."
      />
      <Button asChild className="w-full">
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
};

const AuthorizeStep = ({
  token,
  onAuthorized,
}: {
  token: string;
  onAuthorized: (challengeId: string, newEmail: string) => void;
}) => {
  const { mutate, isPending } = useAuthorizeEmailChange();

  const form = useForm<AuthorizeEmailChangeDto>({
    resolver: zodResolver(authorizeEmailChangeSchema),
    defaultValues: { token, password: "", newEmail: "" },
  });
  const { errors } = form.formState;

  const onSubmit = (values: AuthorizeEmailChangeDto) =>
    mutate(values, {
      onSuccess: ({ challengeId }) => onAuthorized(challengeId, values.newEmail),
      onError: (error) => setFormError(form, error),
    });

  return (
    <>
      <AuthHeader
        title="Change Email"
        description="Confirm your password and enter the new email"
        error={errors.root?.message}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FieldGroup>
          <TextField
            label="Current password"
            type="password"
            placeholder="********"
            error={errors.password?.message}
            {...form.register("password")}
          />
          <TextField
            label="New email"
            type="email"
            placeholder="sample@example.com"
            error={errors.newEmail?.message}
            {...form.register("newEmail")}
          />
        </FieldGroup>

        <Button disabled={isPending}>{isPending && <Spinner />} Continue</Button>
      </form>
    </>
  );
};

const VerifyStep = ({
  challengeId,
  newEmail,
  onVerified,
}: {
  challengeId: string;
  newEmail: string;
  onVerified: () => void;
}) => {
  const { mutate, isPending } = useVerifyEmailChange();

  const form = useForm<VerifyEmailChangeDto>({
    resolver: zodResolver(verifyEmailChangeSchema),
    defaultValues: { challengeId, otp: "" },
  });
  const { errors } = form.formState;

  const onSubmit = (values: VerifyEmailChangeDto) =>
    mutate(values, {
      onSuccess: onVerified,
      onError: (error) => setFormError(form, error),
    });

  return (
    <>
      <AuthHeader
        title="Verify New Email"
        description={`Enter the code sent to ${newEmail}`}
        error={errors.root?.message}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-2">
          <Controller
            name="otp"
            control={form.control}
            render={({ field }) => (
              <InputOTP
                maxLength={OTP_LENGTH}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                autoComplete="one-time-code"
                {...field}
              >
                <InputOTPGroup>
                  {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} className="w-9" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && <FieldError>{errors.otp.message}</FieldError>}
        </div>

        <Button className="w-full" disabled={isPending}>
          {isPending && <Spinner />} Verify Email
        </Button>
      </form>
    </>
  );
};

export { UpdateEmailForm };
