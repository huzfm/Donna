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
      title: "Donna",
      description:
            "AI-powered workspace assistant that helps you manage documents, email, and calendar through natural conversation.",
      keywords: ["AI", "workspace", "assistant", "documents", "email", "chat", "RAG"],
      openGraph: {
            title: "Donna — Your AI-Powered Workspace",
            description: "Manage documents, email, and calendar with AI.",
            type: "website",
      },
};

export default function RootLayout({
      children,
}: Readonly<{
      children: React.ReactNode;
}>) {
      return (
            <html lang="en" className={`${inter.variable} ${doto.variable}`}>
                  <body>
                        <div className="pointer-events-none fixed inset-0 z-0">
                              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[60px_60px]" />
                        </div>
                        <Suspense fallback={<RootLoading />}>{children}</Suspense>
                  </body>
            </html>
      );
}
