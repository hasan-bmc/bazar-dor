import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#dce6dd] bg-[#fbfdfb] px-5 py-7 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="max-w-lg">
          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold text-green-800">
            বাজার দর • প্রতিদিনের আপডেট
          </span>

          <h1 className="mt-3 text-2xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
            আজকের সব বাজারের দাম
            <br />
            এক নজরে
          </h1>

          <p className="mt-3 max-w-md text-xs leading-6 text-gray-600 sm:text-sm">
            চাল, ডাল, তেল, সবজি, মাছ, মাংসসহ নিত্যপ্রয়োজনীয়
            পণ্যের দাম জানুন সহজেই।
          </p>

          <Link
            href="#all-products"
            className="mt-4 inline-flex rounded-lg bg-green-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-green-800"
          >
            সব পণ্য দেখুন →
          </Link>
        </div>

        <div
          className="shrink-0 text-6xl sm:text-8xl"
          aria-hidden="true"
        >
          🧺
        </div>
      </div>
    </section>
  );
}
