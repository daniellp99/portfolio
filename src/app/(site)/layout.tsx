import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/Providers";

import "@/../node_modules/react-grid-layout/css/styles.css";
import "./globals.css";

export default function HomeLayout({
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
