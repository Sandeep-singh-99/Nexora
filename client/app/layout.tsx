import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Nexora AI — Your Knowledge. Your Research. One Intelligent Workspace.",
  description:
    "Nexora AI brings your knowledge, research, AI agents, and intelligent workflows together in one powerful workspace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark scroll-smooth`}>
      <body className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
