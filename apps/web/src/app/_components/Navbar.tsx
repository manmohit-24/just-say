import Link from "next/link";

import { constants } from "@/config/constants";
import { Logo } from "@/shared/components/Logo";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { Button } from "@/shared/components/ui/button";

const Navbar = () => (
  <nav className="w-full bg-secondary-foreground dark:bg-card fixed top-0 z-100 text-background dark:text-foreground px-6 py-3 flex items-center justify-between">
    <Link href="/" className="text-xl font-semibold flex items-center gap-2">
      <Logo className="size-10" />
      {constants.appName}
    </Link>

    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    </div>
  </nav>
);

export { Navbar };
