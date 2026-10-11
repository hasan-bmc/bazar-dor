
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-1 items-center justify-center bg-[#f0f5f1] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#dce6dd] bg-[#fbfdfb] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
        {/* Illustration */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#e2f2e7] text-5xl">
          🧺
        </div>

        <p className="mt-7 text-sm font-bold tracking-widest text-[#078b43]">
          ERROR 404
        </p>

        <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-gray-600">
          দুঃখিত! আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে,
          ঠিকানা পরিবর্তন হয়েছে অথবা পেজটি আর উপলব্ধ নেই।
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#078b43] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#066f36] focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            <span aria-hidden="true">⌂</span>
            হোম পেজে ফিরে যান
          </Link>

          <Link
            href="/#all-products"
            className="inline-flex items-center justify-center rounded-xl border border-[#dce6dd] px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            সব পণ্য দেখুন
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>
      </div>
    </main>
  );
}
