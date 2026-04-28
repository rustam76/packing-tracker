import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { MissingKeysUI } from "@/components/missing-keys-ui";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const viewport = {
  themeColor: "#0058be",
};

export const metadata: Metadata = {
  title: "Packing Tracker",
  description: "Efficient packing management for couples and trips.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Packing Tracker",
  },
};

import { PWAInstaller } from "@/components/pwa-installer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased text-surface-on bg-surface`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <PWAInstaller />
          <MissingKeysUI />
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
