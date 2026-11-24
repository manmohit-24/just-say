"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { deleteProfileSchema, type DeleteProfileDto } from "@repo/contracts";

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

import { useDeleteProfile } from "../user.queries";

const DeleteProfileDialog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutate: deleteProfile, isPending } = useDeleteProfile();

  const form = useForm<DeleteProfileDto>({
    resolver: zodResolver(deleteProfileSchema),
    defaultValues: { password: "" },
  });
  const { errors } = form.formState;

  const onSubmit = (values: DeleteProfileDto) =>
    deleteProfile(values, {
      onSuccess: () => {
        toast.success("Your account is scheduled for deletion");
        toast.warning("You have been logged out");
        // the API already removed the session cookies
        queryClient.clear();
        router.replace("/");
        router.refresh();
      },
      onError: (error) => setFormError(form, error),
    });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              type="button"
              aria-label="Delete profile"
              className="border-destructive/50 dark:border-destructive/30 text-destructive hover:bg-destructive dark:hover:bg-destructive hover:text-background"
            >
              <Trash2 />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Delete Profile</TooltipContent>
      </Tooltip>

      <DialogContent showCloseButton={false} className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Delete Your Account ?</DialogTitle>
            <DialogDescription>
              Your account will be deactivated for 7 days before permanent deletion. You can log in
              anytime during this period to restore it.
            </DialogDescription>
            {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
          </DialogHeader>

          <FieldGroup>
            <TextField
              label="Enter your password to confirm deletion"
              type="password"
              placeholder="********"
              error={errors.password?.message}
              {...form.register("password")}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" className="font-bold" disabled={isPending}>
              {isPending && <Spinner />} Confirm Deletion
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteProfileDialog };
