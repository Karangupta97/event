import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
<<<<<<< Updated upstream
  title: "EventFlow — Organizer Console",
  description:
    "Smart Event Crowd Management — monitor the venue and act before it gets crowded.",
=======
  title: "EventFlow 2025",
  description: "Venue operations and volunteer staff console",
>>>>>>> Stashed changes
};

export default function RootLayout({
  children,
<<<<<<< Updated upstream
}: {
  children: React.ReactNode;
}) {
=======
}: Readonly<{
  children: React.ReactNode;
}>) {
>>>>>>> Stashed changes
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
