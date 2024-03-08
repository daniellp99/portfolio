import { ThemeProvider } from "@/components/Providers";

import "./globals.css";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen w-full">{children}</main>
    </ThemeProvider>
  );
}
