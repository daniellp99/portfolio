import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Metadata, Viewport } from "next";

import "@/../node_modules/react-grid-layout/css/styles.css";
import { getOwnerDataDTO } from "@/data/project-dto";
import {
  getAbsoluteImageUrl,
  getCanonicalUrl,
  getMetadataBase,
} from "@/utils/metadata";

export const metadata: Promise<Metadata> = (async () => {
  const ownerData = await getOwnerDataDTO();

  const title = ownerData?.name ? `${ownerData.name}'s Portfolio` : "";
  const description = ownerData?.aboutMe || "";

  // Use owner's logo or fallback to default logo
  const ogImage = getAbsoluteImageUrl("/Avatar.webp");

  const ownerName = ownerData?.name || "";

  const homeUrl = getCanonicalUrl("");

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: title,
      template: `${title} | %s`,
    },
    description,
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
    applicationName: `${ownerName}'s Portfolio`,
    category: "Portfolio",
    alternates: {
      canonical: homeUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: `${ownerName}'s Portfolio`,
      title,
      description,
      url: homeUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
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
})();

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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
