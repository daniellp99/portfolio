import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daniel's Portfolio",
  description: "Developer from Cuba.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} bg-zinc-100 dark:bg-zinc-950`}
      >
        {children}
      </body>
    </html>
  );
}
