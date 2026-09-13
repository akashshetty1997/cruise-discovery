import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site";

export const metadata: Metadata = {
  title: "Cruise discovery — Your next cruise, reimagined.",
  description: "Find exceptional cruise deals with thoughtful guidance from experienced cruise advisors."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
