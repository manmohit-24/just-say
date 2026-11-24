import Link from "next/link";
import { MessageSquare, ShieldCheck, Smile } from "lucide-react";

import { constants } from "@/config/constants";
import { redirectIfAuthenticated } from "@/modules/auth/server";
import { Logo } from "@/shared/components/Logo";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

const features = [
  {
    icon: <MessageSquare className="h-6 w-6 text-rose-500" />,
    title: "Say Anything",
    description: "Send messages — anonymous or not — your choice.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-violet-500" />,
    title: "Privacy First",
    description: "Your words are yours — we keep it safe and private.",
  },
  {
    icon: <Smile className="h-6 w-6 text-amber-500" />,
    title: "Stay Chill",
    description: "A playful vibe that makes truth feel lighter.",
  },
];

const HomePage = async () => {
  await redirectIfAuthenticated();

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-35">
        <div className="flex flex-col items-center">
          <Logo className="size-30" />
          <p className="text-5xl font-extrabold">{constants.appName}</p>
        </div>

        <h1 className="text-4xl sm:text-3xl mt-2 font-bold opacity-80">
          Don’t gossip,
          <span className="text-indigo-600"> just say it.</span>
        </h1>

        <p className="mt-4 text-muted-foreground max-w-md">
          A simple way to send honest or anonymous messages — where words mean more than drama.
        </p>

        <Button asChild className="mt-8 w-60 text-md">
          <Link href="/login">Start Asking</Link>
        </Button>
      </section>

      <section className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 px-6">
        {features.map(({ icon, title, description }) => (
          <Card
            key={title}
            className="flex flex-col items-center text-center p-6 gap-3 border border-muted"
          >
            <div className="p-3 rounded-full border border-muted-foreground">{icon}</div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
