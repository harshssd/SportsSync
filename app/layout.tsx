


import * as React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SportsSync",
  description: "Connect your Instagram and manage your social media.",
};

export default function RootLayout({
  children,
}: Readonly<{
  // FIX: Use React.ReactNode to fix 'Cannot find namespace React' error and resolve component children typing.
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
