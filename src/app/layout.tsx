import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Metadata, Viewport } from "next";
import { Suspense, ViewTransition } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { ThemeProvider } from "@/components/Providers";
import { NavBar } from "@/components/nav-bar";
import { NavItems } from "@/features/home/components/nav-items";
import { getOwnerData } from "@/features/owner/owner-queries";
import { buildRootLayoutMetadata } from "@/lib/site/metadata";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const ownerData = getOwnerData();

  return buildRootLayoutMetadata(ownerData);
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

function NavItemsSkeleton() {
  return <Skeleton className="h-12 w-68.25 rounded-full" />;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contactEmail = getOwnerData().email;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://c.basemaps.cartocdn.com"
          crossOrigin="anonymous"
        />
      </head>
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
              <NavBar contactEmail={contactEmail}>
                <Suspense
                  fallback={
                    <ViewTransition exit="slide-down">
                      <NavItemsSkeleton />
                    </ViewTransition>
                  }
                >
                  <ViewTransition enter="slide-up" default="none">
                    <NavItems />
                  </ViewTransition>
                </Suspense>
              </NavBar>
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
