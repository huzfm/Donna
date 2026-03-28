import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Donna",
  description:
    "Learn about Donna, an AI-powered workspace assistant for documents, email, and calendar. Meet the team and explore the tech stack.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
