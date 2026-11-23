"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { resetPasswordSchema } from "@repo/contracts";

import { TextField } from "@/shared/components/form/TextField";
import { Button } from "@/shared/components/ui/button";
import { FieldGroup } from "@/shared/components/ui/field";
import { Spinner } from "@/shared/components/ui/spinner";
import { setFormError } from "@/shared/lib/form";

import { useResetPassword } from "../auth.queries";
import { AuthHeader } from "./AuthHeader";

// the token comes from the email link, so the form only asks for the password (twice)
const formSchema = resetPasswordSchema
  .pick({ newPassword: true })
  .extend({ confirmNewPassword: z.string() })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();
  const { mutate, isPending } = useResetPassword();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { newPassword: "", confirmNewPassword: "" },
  });
  const { errors } = form.formState;

  const onSubmit = ({ newPassword }: FormValues) =>
    mutate(
      { token, newPassword },
      {
        onSuccess: () => {
          toast.success("Password reset successfully");
          router.push("/login");
        },
        onError: (error) => setFormError(form, error),
      }
    );

  return (
    <>
      <AuthHeader
        title="Reset Password"
        description="Enter your new password"
        error={errors.root?.message}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FieldGroup>
          <TextField
            label="New Password"
            type="password"
            placeholder="********"
            error={errors.newPassword?.message}
            {...form.register("newPassword")}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            placeholder="********"
            error={errors.confirmNewPassword?.message}
            {...form.register("confirmNewPassword")}
          />
        </FieldGroup>

        <Button disabled={isPending}>{isPending && <Spinner />} Continue</Button>
      </form>
    </>
  );
};

export { ResetPasswordForm };
