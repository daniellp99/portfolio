import { ScrollArea } from "@/components/ui/scroll-area";

import { ThemeProvider } from "@/components/Providers";

import "./globals.css";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ScrollArea className="h-screen">
        <main className="w-full">{children}</main>
      </ScrollArea>
    </ThemeProvider>
  );
}
