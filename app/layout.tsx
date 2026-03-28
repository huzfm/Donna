import type { Metadata } from "next";
import { Inter, Doto } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import RootLoading from "./loading";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Donna — Your AI-Powered Workspace",
  description:
    "AI-powered workspace for email & meetings. Send emails, schedule meetings, and chat with your AI assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${doto.variable}`}>
      <body>
        <Suspense fallback={<RootLoading />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
