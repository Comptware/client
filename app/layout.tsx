//app/layout.tsx
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { auth0 } from "lib/auth0";
import { Session } from "@/types";
import clsx from "clsx";
import ChatWidget from "@/components/Chat/ChatWidget";

export const metadata: Metadata = {
  title: "Suncore Digital",
  description: "Suncore Digital Dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await auth0.getSession()) as unknown as Session;

  return (
    <html lang="en">
      <body className={clsx("font-sans antialiased")}>
        <Providers session={session}>
          {children}
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
