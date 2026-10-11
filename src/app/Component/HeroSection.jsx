
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const [bangladeshDate, setBangladeshDate] = useState("");

  useEffect(() => {
    const formattedDate = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    }).format(new Date());

    setBangladeshDate(formattedDate);
  }, []);

  return (
    <section className="overflow-hidden rounded-3xl border border-[#dce6dd] bg-[#fbfdfb] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="grid items-center gap-8 md:grid-cols-[1.35fr_0.85fr] md:gap-6">
        {/* Left content */}
        <div className="max-w-2xl">
          <span className="inline-flex min-h-7 items-center rounded-full bg-[#e1f1e7] px-3 py-1.5 text-xs font-medium text-[#078b43] sm:text-sm">
            {bangladeshDate || "বাজার দর • প্রতিদিনের আপডেট"}
          </span>

          <h1 className="mt-4 text-3xl font-extrabold leading-[1.25] tracking-tight text-[#111c15] sm:text-4xl lg:text-5xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ
            এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <Link
            href="#all-products"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#078b43] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#066f36] focus:outline-none focus:ring-2 focus:ring-[#078b43] focus:ring-offset-2"
          >
            সব পণ্য দেখুন
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        {/* Right image */}
        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center md:max-w-none">
          <Image
            src="/bazar-hero.png"
            alt="বাজারের তাজা শাকসবজি ও পণ্য"
            width={480}
            height={360}
            priority
            className="h-auto w-full max-w-[300px] object-contain sm:max-w-[360px] lg:max-w-[400px]"
            sizes="(max-width: 768px) 80vw, 400px"
          />
        </div>
      </div>
    </section>
  );
}
