"use client";

import React from "react";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ServiceProvider } from "@/lib/ServiceContext";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <LanguageProvider>
          <ServiceProvider>
            {children}
          </ServiceProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
