import type { Metadata } from "next";
import { Inter } from "next/font/google";
import clsx from "clsx";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={clsx(inter.className, "flex min-h-screen flex-col bg-gray-200")}
      >
        <Navbar />
        <main className="flex-1 p-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
