import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";
import { DepProvider } from "@/components/context/dep-provider";
import { Footer } from "@/components/ui/footer";
import Header from "@/components/ui/header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontSans.className
        )}
      >
        <DepProvider>
          <Header />
          {children}
        </DepProvider>
        <Footer />
      </body>
    </html>
  );
}
