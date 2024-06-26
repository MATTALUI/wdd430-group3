import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import clsx from "clsx";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Handcrafted Haven',
    default: 'Handcrafted Haven',
  },
  description: "A marketplace for artisans",
  openGraph: {
    title: "Handcrafted Haven",
    description: "A marketplace for artisans",
    type: "website",
    locale: "en_US",
    url: "https://wdd430-group3.vercel.app",
    siteName: "Handcrafted Haven",
  },
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body
          className={clsx(nunito.className, "flex min-h-screen flex-col bg-light-trans")}
        >
          <Navbar />
          <main className="flex-1 p-4">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </SessionProvider>
  );
}
