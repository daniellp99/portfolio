import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Metadata, Viewport } from "next";

import "@/../node_modules/react-grid-layout/css/styles.css";
import { ThemeProvider } from "@/components/Providers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getOwnerDataDTO } from "@/data/project-dto";
import {
  getAbsoluteImageUrl,
  getCanonicalUrl,
  getMetadataBase,
  getOwnerAvatarPath,
} from "@/utils/metadata";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const ownerData = await getOwnerDataDTO();

  const ownerName = ownerData?.name || "";
  const brandTitle = ownerName ? `${ownerName}'s Portfolio` : "Portfolio";
  const description = ownerData?.aboutMe || "";

  const avatarPath = getOwnerAvatarPath(ownerData?.avatar);
  const ogImage = getAbsoluteImageUrl(avatarPath);

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
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: brandTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: brandTitle,
      description,
      images: [ogImage],
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ScrollArea className="h-screen">
            <main className="w-full">{children}</main>
          </ScrollArea>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
