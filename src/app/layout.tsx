import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";
import { DepProvider } from "@/components/context/dep-provider";
import { Footer } from "@/components/ui/footer";
import Header from "@/components/ui/custom/header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI mixologist",
  description: "Create awesome cocktail recipes with AI",
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
          {/* TODO: offset header */}
          <div>
            {children}
          </div>
        </DepProvider>
        <Footer />
      </body>
    </html>
  );
}
