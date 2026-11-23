"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

import { getErrorMessage } from "@/shared/api";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { useCurrentUser } from "../auth.context";
import { useLogout } from "../auth.queries";

const UserMenu = () => {
  const user = useCurrentUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: logout } = useLogout();

  const handleLogout = () =>
    logout(undefined, {
      onSuccess: () => {
        // nothing cached for this user should outlive the session
        queryClient.clear();
        router.replace("/login");
        router.refresh();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  if (!user) {
    return (
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="rounded-full p-0 w-10 h-10">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-white hover:bg-neutral-700 text-black hover:text-white">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 z-110">
        <DropdownMenuLabel>
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center">
            <User className="w-4 h-4 mr-2" /> Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserMenu };
