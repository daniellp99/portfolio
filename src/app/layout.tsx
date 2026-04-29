import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Metadata, Viewport } from "next";

import "@/../node_modules/react-grid-layout/css/styles.css";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/Providers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getOwnerData } from "@/lib/server/owner";
import {
  getCanonicalUrl,
  getMetadataBase,
  getOwnerAvatarPath,
} from "@/lib/site/metadata";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const ownerData = await getOwnerData();

  const ownerName = ownerData?.name || "";
  const brandTitle = ownerName ? `${ownerName}'s Portfolio` : "Portfolio";
  const description = ownerData?.aboutMe || "";

  const avatarPath = getOwnerAvatarPath(ownerData?.avatar);

  const homeUrl = getCanonicalUrl("");

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: brandTitle,
      template: `%s | ${brandTitle}`,
    },
    description,
    icons: {
      icon: avatarPath,
      apple: avatarPath,
    },
    keywords: [
      "web developer",
      "full-stack developer",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Shadcn UI",
      "AuthJS",
      "Drizzle ORM",
      "portfolio",
      ownerName,
      "Cuba",
    ],
    authors: [{ name: ownerName }],
    creator: ownerName,
    applicationName: brandTitle,
    category: "Portfolio",
    alternates: {
      canonical: homeUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: brandTitle,
      title: brandTitle,
      description,
      url: homeUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: brandTitle,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
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
          <TooltipProvider>
            <ScrollArea className="h-screen">
              <main id="main" className="w-full">
                <NavBar />
                {children}
              </main>
            </ScrollArea>
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
