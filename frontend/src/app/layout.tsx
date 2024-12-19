import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./Header/Header";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "../lib/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../lib/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ReviewMe",
  description: "An app to review companies and services",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
          <Header />
          {children}
          <Footer />
        </body>
    </html>
  );
}
