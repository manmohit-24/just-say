"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleHelp, Info } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { sendMessageSchema, type GetUserResponse } from "@repo/contracts";

import { useCurrentUser } from "@/modules/auth";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Separator } from "@/shared/components/ui/separator";
import { Spinner } from "@/shared/components/ui/spinner";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { setFormError } from "@/shared/lib/form";

import { useSendMessage } from "../messaging.queries";
import type { Anonymity } from "../messaging.types";
import { AIMessageHelper } from "./AIMessageHelper";

// The form has two switches, which are combined into the single `anonymity` value of the API
const formSchema = sendMessageSchema.pick({ content: true }).extend({
  isAnonymous: z.boolean(),
  isTrulyAnonymous: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const toAnonymity = ({ isAnonymous, isTrulyAnonymous }: FormValues): Anonymity => {
  if (isTrulyAnonymous) return "TRULY_ANONYMOUS";
  return isAnonymous ? "ANONYMOUS" : "NONE";
};

const SendMessageForm = ({ receiver }: { receiver: GetUserResponse }) => {
  const viewer = useCurrentUser();
  const { mutate, isPending } = useSendMessage();

  // visitors who are not logged in can only send truly anonymous messages
  const isLoggedIn = viewer !== null;
  const isSelf = viewer?.username === receiver.username;
  const canSend = receiver.isAcceptingMessages && !isSelf;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "", isAnonymous: false, isTrulyAnonymous: false },
  });
  const { errors } = form.formState;

  const onSubmit = (values: FormValues) =>
    mutate(
      {
        receiver: receiver.username,
        content: values.content,
        anonymity: isLoggedIn ? toAnonymity(values) : "TRULY_ANONYMOUS",
      },
      {
        onSuccess: () => {
          toast.success("Message sent");
          form.reset({ ...values, content: "" });
        },
        onError: (error) => setFormError(form, error),
      }
    );

  const switchDisabled = !isLoggedIn || isPending || !canSend;

  return (
    <>
      <Card className="w-full gap-1">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-foreground rounded-full flex items-center justify-center">
              <AvatarFallback className="text-background font-bold">
                {receiver.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <CardTitle className="text-base font-semibold">{receiver.name}</CardTitle>
              <CardDescription className="text-xs">@{receiver.username}</CardDescription>
            </div>
          </div>
          <Separator />
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="content">
                  Write Your Message
                  {!receiver.isAcceptingMessages && (
                    <FieldError>({receiver.name} is currently not accepting messages )</FieldError>
                  )}
                </FieldLabel>
                <Textarea
                  id="content"
                  placeholder="Type your anonymous message here..."
                  className="min-h-[120px] resize-none"
                  disabled={isPending || !canSend}
                  {...form.register("content")}
                />
                <FieldError>{errors.content?.message ?? errors.root?.message}</FieldError>
              </Field>
            </FieldGroup>

            <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between mt-4">
              <div className="w-full space-y-4">
                <Controller
                  name="isAnonymous"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2 text-nowrap">
                      <Switch
                        id="isAnonymous"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={switchDisabled}
                      />
                      <FieldLabel htmlFor="isAnonymous" className="text-sm text-muted-foreground">
                        Send anonymously
                      </FieldLabel>
                      <InfoTooltip content="Stay anonymous while keeping control — the receiver will not be able to see you but you can still unsend your message later." />
                    </div>
                  )}
                />

                <Controller
                  name="isTrulyAnonymous"
                  control={form.control}
                  render={({ field }) => (
                    <div>
                      <div className="flex items-center gap-2 text-nowrap">
                        <Switch
                          id="isTrulyAnonymous"
                          checked={!isLoggedIn || field.value}
                          onCheckedChange={field.onChange}
                          disabled={switchDisabled}
                        />
                        <FieldLabel
                          htmlFor="isTrulyAnonymous"
                          className="text-sm text-muted-foreground"
                        >
                          Send Truly Anonymously
                        </FieldLabel>
                        <InfoTooltip content="Go fully invisible — this message is completely detached from your account for total privacy and freedom. It can't be unsent later." />
                      </div>
                      {!isLoggedIn && (
                        <FieldDescription className="flex items-center text-indigo-500 italic mt-1">
                          <Info className="h-4 w-4 mr-1" />
                          You are not logged in, so your message is sent truly anonymously
                        </FieldDescription>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex items-center">
                <Button type="submit" className="px-6 font-medium" disabled={isPending || !canSend}>
                  {isPending ? (
                    <>
                      <Spinner /> Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
                {isSelf && (
                  <InfoTooltip
                    content="You can't send a message to yourself"
                    iconClassName="h-5 w-5 text-destructive/50 hover:text-destructive"
                  />
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator className="mt-6" />

      <AIMessageHelper
        onUse={(message) => form.setValue("content", message, { shouldValidate: true })}
      />

      <Separator className="mt-6" />

      <div className="w-full flex justify-center mt-10">
        <Button
          asChild
          variant="outline"
          className="h-10 text-md border-2 border-indigo-600/50 dark:border-indigo-400/30 text-indigo-600 dark:text-indigo-400 hover:text-white dark:hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600"
        >
          <Link href={isLoggedIn ? "/dashboard" : "/login"}>
            Click Here to Get Your Just-Say Link
          </Link>
        </Button>
      </div>
    </>
  );
};

const InfoTooltip = ({ content, iconClassName }: { content: string; iconClassName?: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        aria-label="More info"
        className="ml-1 text-muted-foreground hover:text-foreground"
      >
        <CircleHelp className={iconClassName ?? "h-4 w-4"} />
      </button>
    </TooltipTrigger>
    <TooltipContent className="max-w-xs text-sm">{content}</TooltipContent>
  </Tooltip>
);

export { SendMessageForm };
