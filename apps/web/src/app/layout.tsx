import type { Metadata } from "next";

import { constants } from "@/config/constants";
import { Providers } from "@/shared/components/Providers";

import { Navbar } from "./_components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: constants.appName, template: `%s | ${constants.appName}` },
  description: constants.description,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  // next-themes adds the theme class to <html> before React loads, hence suppressHydrationWarning
  <html lang="en" className="scroll-smooth bg-background" suppressHydrationWarning>
    <body>
      <Providers>
        <Navbar />
        <main className="mt-16">{children}</main>
      </Providers>
    </body>
  </html>
);

export default RootLayout;
