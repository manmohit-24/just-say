"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { updateProfileSchema, type GetUserResponse, type UpdateProfileDto } from "@repo/contracts";

import { getErrorMessage } from "@/shared/api";
import { TextField } from "@/shared/components/form/TextField";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { FieldGroup } from "@/shared/components/ui/field";
import { Spinner } from "@/shared/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { setFormError } from "@/shared/lib/form";

import { useRequestEmailChange, useUpdateProfile } from "../user.queries";
import { UsernameAvailabilityHint } from "./UsernameAvailabilityHint";

const EditProfileDialog = ({ user }: { user: GetUserResponse }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: requestEmailChange } = useRequestEmailChange();

  const form = useForm<UpdateProfileDto>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name, username: user.username },
  });
  const { errors } = form.formState;
  const username = useWatch({ control: form.control, name: "username" }) ?? "";

  const onSubmit = (values: UpdateProfileDto) =>
    updateProfile(values, {
      onSuccess: () => {
        toast.success("Profile updated");
        form.reset(values);
        setOpen(false);
        // loads the user again, so the page and the navbar show the new details
        router.refresh();
      },
      onError: (error) => setFormError(form, error),
    });

  const handleChangeEmail = () =>
    requestEmailChange(undefined, {
      onSuccess: () => toast.success("We sent a link to your email to continue the change"),
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="default" size="icon" type="button" aria-label="Edit profile">
              <SquarePen />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Edit Profile</TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
            {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
          </DialogHeader>

          <FieldGroup>
            <TextField
              label="Full Name"
              placeholder="Name here ... "
              disabled={isPending}
              error={errors.name?.message}
              {...form.register("name")}
            />
            <TextField
              label="Username"
              placeholder="enter a unique username ... "
              disabled={isPending}
              error={errors.username?.message}
              hint={
                <UsernameAvailabilityHint username={username} currentUsername={user.username} />
              }
              {...form.register("username")}
            />
          </FieldGroup>

          <Button
            type="button"
            variant="link"
            className="justify-start p-0 h-auto"
            onClick={handleChangeEmail}
          >
            Want to change your email address?
          </Button>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner />} Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { EditProfileDialog };
