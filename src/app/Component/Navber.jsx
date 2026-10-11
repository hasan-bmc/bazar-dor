
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import NavLinks from "./NavLinks";
import Marquee from "./Marquee";
import AuthMenu from "./AuthMenu";

function getBanglaDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

export default function Navbar() {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(getBanglaDate());
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-100 bg-white/95 backdrop-blur">
      {/* Main header */}
      <div className="mx-auto flex max-w-[1420px] items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-700 text-xl text-white shadow-sm">
            🛒
          </span>

          <span className="min-w-0">
            <span className="block text-lg font-extrabold leading-tight text-green-900 sm:text-xl">
              বাজার দর
            </span>

            <span className="mt-1 block text-[11px] text-gray-500 sm:text-xs">
              {date || "নিত্যপণ্যের বাজারদর"}
            </span>
          </span>
        </Link>

        <div className="shrink-0">
          <AuthMenu />
        </div>
      </div>

      {/* Category navigation */}
      <NavLinks />

      {/* Scrolling market prices */}
      <div className="border-t border-gray-100 bg-[#fbfdfb]">
        <Marquee />
      </div>
    </header>
  );
}
