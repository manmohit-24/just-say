"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema, type ForgotPasswordDto } from "@repo/contracts";

import { TextField } from "@/shared/components/form/TextField";
import { Button } from "@/shared/components/ui/button";
import { FieldGroup } from "@/shared/components/ui/field";
import { Spinner } from "@/shared/components/ui/spinner";
import { setFormError } from "@/shared/lib/form";

import { useForgotPassword } from "../auth.queries";
import { AuthHeader } from "./AuthHeader";
import { EmailSentNotice } from "./EmailSentNotice";

const ForgotPasswordForm = () => {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { mutate, isPending } = useForgotPassword();

  const form = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const { errors } = form.formState;

  const onSubmit = (values: ForgotPasswordDto) =>
    mutate(values, {
      onSuccess: () => setSentTo(values.email),
      onError: (error) => setFormError(form, error),
    });

  if (sentTo) {
    return (
      <EmailSentNotice title="Check your inbox">
        If an account exists for <span className="font-medium text-foreground">{sentTo}</span>,
        you’ll shortly receive an email with steps to reset your password.
      </EmailSentNotice>
    );
  }

  return (
    <>
      <AuthHeader
        title="Forgot Password"
        description="Enter your email to reset your password"
        error={errors.root?.message}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FieldGroup>
          <TextField
            label="Email"
            type="email"
            placeholder="sample@example.com"
            error={errors.email?.message}
            {...form.register("email")}
          />
        </FieldGroup>

        <Button disabled={isPending}>{isPending && <Spinner />} Continue</Button>

        <p className="text-center">
          Back to{" "}
          <Link href="/login" className="underline text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </>
  );
};

export { ForgotPasswordForm };
