import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { cookies } from "next/headers";

import "./globals.css";

import { cn } from "@/lib/utils";

import Navbar from "@components/layouts/navbar";
import AppSidebar from "@components/layouts/appSidebar";
import { ThemeProvider } from "@components/ui/themeProvider";
import { SidebarProvider } from "@components/ui/sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social Media",
  description: "My First Social Media Practice App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <SidebarProvider
            defaultOpen={defaultOpen}
            className="min-h-full gap-4"
          >
            <AppSidebar />
            <main className="w-full h-screen place-items-center p-8">
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
