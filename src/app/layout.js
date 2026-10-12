
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "./Component/Navber";
import Footer from "./Component/Footer";
import ToastProvider from "./ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali", "latin"],
  display: "swap",
});

export const metadata = {
  title: "বাজার দর | আজকের বাজারের দাম",
  description:
    "চাল, ডাল, তেল, সবজি, মাছ ও মাংসসহ নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর জানুন।",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansBengali.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-[family-name:var(--font-noto-sans-bengali)]">
        <Suspense
          fallback={
            <div className="h-20 animate-pulse bg-[#f9fcf9]" />
          }
        >
          <Navbar />
        </Suspense>
        <ToastProvider />
        {children}

        <Footer />

      </body>
    </html>
  );
}
