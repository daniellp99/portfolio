import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Metadata, Viewport } from "next";

import NavBar from "@/components/server/NavBar";
import { ThemeProvider } from "@/components/Providers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getOwnerData } from "@/lib/server/owner";
import { buildRootLayoutMetadata } from "@/lib/site/metadata";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const ownerData = await getOwnerData();
  return buildRootLayoutMetadata(ownerData ?? undefined);
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ScrollArea className="h-screen">
            <main id="main" className="w-full">
              <NavBar />
              {children}
            </main>
          </ScrollArea>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
