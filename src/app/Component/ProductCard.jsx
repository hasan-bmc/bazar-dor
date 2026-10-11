"use client";

export default function ProductCard({ product }) {
  const direction = product.change?.dir;
  const isUp = direction === "up";
  const isDown = direction === "down";

  const name =
    product.nameBn || product.name || product.slug || "পণ্য";

  return (
    <article className="min-w-0 rounded-xl border border-[#dce6dd] bg-[#fbfdfb] p-3 transition hover:border-green-300 hover:shadow-sm">
      <div className="flex items-start gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f0f6ef] text-xl">
          {product.image || product.categoryIcon || "🛒"}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xs font-bold text-gray-800 sm:text-sm">
            {name}
          </h3>

          <p className="mt-0.5 text-[10px] text-gray-500">
            {product.categoryNameBn ||
              product.categoryBn ||
              product.category ||
              "নিত্যপ্রয়োজনীয় পণ্য"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-1">
        <div>
          <p className="text-[10px] text-gray-500">আজকের দাম</p>
          <p className="text-sm font-bold text-gray-900">
            ৳{product.today ?? "—"}
            <span className="ml-1 text-[10px] font-normal text-gray-500">
              /{product.unit || "একক"}
            </span>
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-1.5 py-1 text-[9px] font-semibold ${
            isUp
              ? "bg-red-50 text-red-600"
              : isDown
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-500"
          }`}
        >
          {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
          {product.change?.pct ?? 0}%
        </span>
      </div>
    </article>
  );
}
