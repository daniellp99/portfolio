import { generateLayouts } from "@/actions";
import { LayoutsContextProvider } from "@/components/LayoutsContext";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/Providers";

import "./globals.css";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultLayouts = await generateLayouts("All");

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LayoutsContextProvider defaultLayouts={defaultLayouts}>
        <NavBar />
        {children}
      </LayoutsContextProvider>
    </ThemeProvider>
  );
}
