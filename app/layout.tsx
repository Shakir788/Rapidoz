import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 👇 Import the Language Provider
import { LanguageProvider } from "../components/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rapidoz - Morocco",
  description: "Simple. Structured. Safe. Dispatch System.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 👇 Wrap everything inside LanguageProvider to enable EN/FR/AR */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}