import type { ReactNode } from "react";
import { MailCheck } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

const EmailSentNotice = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex flex-col items-center p-8 text-center">
    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
      <MailCheck className="w-10 h-10 text-primary" />
    </div>

    <h1 className="text-2xl font-bold mb-2">{title}</h1>
    <p className="text-sm text-muted-foreground mb-6">{children}</p>

    <Button asChild className="w-full">
      <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
        Open Gmail
      </a>
    </Button>
  </div>
);

export { EmailSentNotice };
