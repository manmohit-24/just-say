"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import type { GetUserResponse } from "@repo/contracts";

import { env } from "@/config/env";
import { getErrorMessage } from "@/shared/api";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

import { useUpdateProfile } from "../user.queries";
import { DeleteProfileDialog } from "./DeleteProfileDialog";
import { EditProfileDialog } from "./EditProfileDialog";

const ProfileHeader = ({ user }: { user: GetUserResponse }) => {
  const [isAccepting, setIsAccepting] = useState(user.isAcceptingMessages);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // people send messages to you through this link
  const profileUrl = `${env.NEXT_PUBLIC_APP_URL}/send/${user.username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const handleToggle = (checked: boolean) => {
    setIsAccepting(checked);

    updateProfile(
      { isAcceptingMessages: checked },
      {
        onError: (error) => {
          setIsAccepting(!checked);
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  return (
    <Card className="w-full gap-1 shadow-sm border-none">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-foreground rounded-full flex items-center justify-center">
              <AvatarFallback className="text-background font-bold bg-transparent">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-semibold">{user.name}</CardTitle>
              <CardDescription className="text-xs">@{user.username}</CardDescription>
            </div>
          </div>

          <div className="flex gap-3">
            <EditProfileDialog user={user} />
            <DeleteProfileDialog />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-1">Your anonymous message link:</p>
        <div className="flex items-center justify-between bg-background border border-border rounded-lg px-3 py-2">
          <span className="truncate text-sm">{profileUrl}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="ml-2"
                onClick={handleCopy}
                aria-label="Copy link"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy to clipboard</TooltipContent>
          </Tooltip>
        </div>

        <label className="mt-4 flex items-center gap-2">
          <Switch checked={isAccepting} onCheckedChange={handleToggle} disabled={isPending} />
          <span>Accept Messages: {isAccepting ? "On" : "Off"}</span>
        </label>
      </CardContent>
    </Card>
  );
};

export { ProfileHeader };
