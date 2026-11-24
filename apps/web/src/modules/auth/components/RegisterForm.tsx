"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { registerSchema, type RegisterDto } from "@repo/contracts";

import { constants } from "@/config/constants";
import { UsernameAvailabilityHint } from "@/modules/user";
import { TextField } from "@/shared/components/form/TextField";
import { Button } from "@/shared/components/ui/button";
import { FieldGroup } from "@/shared/components/ui/field";
import { Spinner } from "@/shared/components/ui/spinner";
import { setFormError } from "@/shared/lib/form";

import { useRegister } from "../auth.queries";
import { AuthHeader } from "./AuthHeader";
import { EmailSentNotice } from "./EmailSentNotice";

const RegisterForm = () => {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const { mutate, isPending } = useRegister();

  const form = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", username: "", email: "", password: "" },
  });
  const { errors } = form.formState;
  const username = useWatch({ control: form.control, name: "username" });

  const onSubmit = (values: RegisterDto) =>
    mutate(values, {
      onSuccess: (user) => setRegisteredEmail(user.email),
      onError: (error) => setFormError(form, error),
    });

  if (registeredEmail) {
    return (
      <EmailSentNotice title="Verify your email">
        We sent a verification link to{" "}
        <span className="font-medium text-foreground">{registeredEmail}</span>. Open it to activate
        your account.
      </EmailSentNotice>
    );
  }

  return (
    <>
      <AuthHeader
        title={`Join ${constants.appName}`}
        description="Sign up to get started"
        error={errors.root?.message}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FieldGroup>
          <TextField
            label="Full Name"
            placeholder="Name here ... "
            error={errors.name?.message}
            {...form.register("name")}
          />
          <TextField
            label="Username"
            placeholder="enter a unique username ... "
            error={errors.username?.message}
            hint={<UsernameAvailabilityHint username={username} />}
            {...form.register("username")}
          />
          <TextField
            label="Email"
            type="email"
            placeholder="sample@example.com"
            error={errors.email?.message}
            {...form.register("email")}
          />
          <TextField
            label="Password"
            type="password"
            placeholder="********"
            error={errors.password?.message}
            {...form.register("password")}
          />
        </FieldGroup>

        <Button disabled={isPending}>{isPending && <Spinner />} Register</Button>

        <p className="text-center">
          Already have an account ?{" "}
          <Link href="/login" className="underline text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </>
  );
};

export { RegisterForm };
