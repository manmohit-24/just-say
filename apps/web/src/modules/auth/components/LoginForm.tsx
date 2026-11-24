"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginSchema, type LoginDto } from "@repo/contracts";

import { TextField } from "@/shared/components/form/TextField";
import { Button } from "@/shared/components/ui/button";
import { FieldGroup } from "@/shared/components/ui/field";
import { Spinner } from "@/shared/components/ui/spinner";
import { setFormError } from "@/shared/lib/form";

import { useLogin } from "../auth.queries";
import { AuthHeader } from "./AuthHeader";

const LoginForm = ({ redirectTo }: { redirectTo: string }) => {
  const router = useRouter();
  const { mutate, isPending } = useLogin();

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });
  const { errors } = form.formState;

  const onSubmit = (values: LoginDto) =>
    mutate(values, {
      onSuccess: () => {
        toast.success("Logged in successfully");
        router.replace(redirectTo);
        // reloads the layout, so the navbar shows the logged in user
        router.refresh();
      },
      onError: (error) => setFormError(form, error),
    });

  return (
    <>
      <AuthHeader
        title="Welcome Back"
        description="Log in to get started"
        error={errors.root?.message}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FieldGroup>
          <TextField
            label="Email/Username"
            placeholder="sample@example.com"
            error={errors.identifier?.message}
            {...form.register("identifier")}
          />
          <div>
            <TextField
              label="Password"
              type="password"
              placeholder="********"
              error={errors.password?.message}
              {...form.register("password")}
            />
            <Link className="text-sm underline text-blue-500" href="/forgot-password">
              Forgot Password ?
            </Link>
          </div>
        </FieldGroup>

        <Button disabled={isPending}>{isPending && <Spinner />} Login</Button>

        <p className="text-center">
          Don&apos;t have an account ?{" "}
          <Link href="/register" className="underline text-blue-500">
            Register
          </Link>
        </p>
      </form>
    </>
  );
};

export { LoginForm };
