import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Web3Provider } from "@/providers/Web3Provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SettleX — Cross-Border Payroll",
  description: "Cross-border payroll settlement on the Tempo blockchain using stablecoins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased bg-[#f9fafb] text-gray-900`}>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
