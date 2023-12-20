import type { Metadata } from "next";

import "@/../../node_modules/react-grid-layout/css/styles.css";
import "./globals.css";

import { ThemeProvider } from "@/components/Providers";
import NavBar from "@/components/NavBar";

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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NavBar />
      {children}
    </ThemeProvider>
  );
}
