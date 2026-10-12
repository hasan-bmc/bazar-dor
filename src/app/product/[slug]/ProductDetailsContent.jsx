
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API =
  "https://openapi.programming-hero.com/api/bazardor/products";

const numberBn = (value) => {
  const n = Number(value);

  return Number.isFinite(n)
    ? n.toLocaleString("bn-BD", { maximumFractionDigits: 2 })
    : "—";
};

function findProduct(json, slug) {
  const root = json?.data ?? json;

  const items = Array.isArray(root)
    ? root
    : Array.isArray(root?.products)
      ? root.products
      : Array.isArray(root?.product)
        ? root.product
        : root?.product && typeof root.product === "object"
          ? [root.product]
          : root && typeof root === "object"
            ? [root]
            : [];

  return (
    items.find((item) => item?.slug === slug) ||
    (items.length === 1 ? items[0] : null)
  );
}

function getMarkets(product) {
  const source =
    product.marketPrices ??
    product.markets ??
    product.prices ??
    product.marketData ??
    [];

  if (Array.isArray(source)) return source;

  if (source && typeof source === "object") {
    return Object.entries(source).map(([name, value]) => ({
      name,
      ...(typeof value === "object" && value !== null
        ? value
        : { price: value }),
    }));
  }

  return [];
}

function ProductIcon({ product }) {
  const icon =
    product.categoryIcon ??
    product.icon ??
    product.category?.icon ??
    product.emoji ??
    "🛒";

  const iconValue =
    typeof icon === "string"
      ? icon
      : typeof icon?.url === "string"
        ? icon.url
        : "🛒";

  const isImage = /^(https?:\/\/|\/)/i.test(iconValue);

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#edf4ed]">
      {isImage ? (
        <img
          src={iconValue}
          alt="পণ্যের আইকন"
          className="h-10 w-10 object-contain"
        />
      ) : (
        <span className="text-3xl">{iconValue}</span>
      )}
    </div>
  );
}

function getCategoryHref(product) {
  const categorySlug =
    product.categorySlug ??
    product.category?.slug ??
    product.category?.categorySlug;

  return categorySlug
    ? `/category/${encodeURIComponent(categorySlug)}`
    : "/category/chal";
}

export default function ProductDetailsContent({ slug }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      setProduct(null);

      try {
        const url = `${API}?slug=${encodeURIComponent(slug)}`;

        const response = await fetch(url, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("API থেকে তথ্য পাওয়া যায়নি।");
        }

        const json = await response.json();
        const found = findProduct(json, slug);

        if (!found) {
          throw new Error("পণ্যটি পাওয়া যায়নি।");
        }

        setProduct(found);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "একটি সমস্যা হয়েছে।");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-[75vh] bg-[#f0f5f1] px-4 py-5 sm:px-6 lg:px-[26px]">
        <div className="mx-auto w-full max-w-[1420px] animate-pulse space-y-4">
          <div className="h-5 w-64 rounded bg-gray-200" />
          <div className="h-28 rounded-2xl bg-white" />
          <div className="h-96 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f0f5f1] p-5">
        <div className="rounded-2xl bg-white p-8 text-center">
          <h1 className="text-xl font-bold">পণ্য পাওয়া যায়নি</h1>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <Link
            href="/"
            className="mt-4 inline-block font-semibold text-green-700 hover:underline"
          >
            হোমে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const name = product.nameBn || product.name || "পণ্যের নাম";
  const unit = product.unit || "কেজি";

  const category =
    product.categoryNameBn ||
    product.categoryBn ||
    (typeof product.category === "string"
      ? product.category
      : product.category?.nameBn) ||
    "পণ্য";

  const categoryHref = getCategoryHref(product);

  const rawToday = product.today ?? product.price ?? 0;
  const today =
    typeof rawToday === "object"
      ? Number(rawToday?.price ?? rawToday?.avg ?? 0)
      : Number(rawToday);

  const change = product.change || {};

  const rows = getMarkets(product).map((market, index) => {
    const min = Number(
      market.minPrice ?? market.min ?? market.low ?? market.price ?? 0
    );

    const max = Number(
      market.maxPrice ?? market.max ?? market.high ?? market.price ?? 0
    );

    const avg = Number(
      market.avgPrice ??
        market.averagePrice ??
        market.avg ??
        market.price ??
        (min + max) / 2
    );

    return {
      id: market.id ?? index,
      name:
        market.marketName ||
        market.bazarName ||
        market.name ||
        market.market ||
        `বাজার ${index + 1}`,
      division:
        market.division ||
        market.divisionName ||
        market.region ||
        "—",
      min,
      max,
      avg,
    };
  });

  const validRows = rows.filter(
    (row) =>
      Number.isFinite(row.min) &&
      Number.isFinite(row.max) &&
      Number.isFinite(row.avg) &&
      row.avg > 0
  );

  const minPrice = validRows.length
    ? Math.min(...validRows.map((row) => row.min))
    : Number(product.minPrice ?? today);

  const maxPrice = validRows.length
    ? Math.max(...validRows.map((row) => row.max))
    : Number(product.maxPrice ?? today);

  const avgPrice = validRows.length
    ? validRows.reduce((sum, row) => sum + row.avg, 0) / validRows.length
    : Number(product.avgPrice ?? today);

  return (
    <main className="min-h-[75vh] bg-[#f0f5f1] px-4 py-5 sm:px-6 lg:px-[26px]">
      <div className="mx-auto w-full max-w-[1420px] space-y-4">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-600"
        >
          <Link href="/" className="transition-colors hover:text-green-700">
            হোম
          </Link>

          <span className="text-gray-400" aria-hidden="true">
            ›
          </span>

          <Link
            href={categoryHref}
            className="transition-colors hover:text-green-700"
          >
            {category}
          </Link>

          <span className="text-gray-400" aria-hidden="true">
            ›
          </span>

          <span
            className="font-medium text-gray-900"
            aria-current="page"
          >
            {name}
          </span>
        </nav>

        {/* Product header */}
        <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#dce6dd] bg-[#fbfdfb] p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <ProductIcon product={product} />

            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold text-gray-950 sm:text-3xl">
                {name}
              </h1>

              <p className="text-xs text-gray-500">
                প্রতি {unit} · {category}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                গতকালের তুলনায় আজকের দাম{" "}
                {change.dir === "up"
                  ? "বেড়েছে"
                  : change.dir === "down"
                    ? "কমেছে"
                    : "অপরিবর্তিত"}
                {change.pct != null ? ` ${numberBn(change.pct)}%` : ""}
              </p>
            </div>
          </div>

          <div className="self-start rounded-xl bg-[#f0f5f1] px-5 py-3 text-center sm:self-auto">
            <p className="text-xs text-gray-500">আজকের দাম</p>
            <p className="text-2xl font-extrabold text-gray-950">
              {numberBn(today)}
            </p>
            <p className="text-xs text-gray-500">টাকা / {unit}</p>

            <p
              className={`text-xs font-semibold ${
                change.dir === "up"
                  ? "text-red-500"
                  : change.dir === "down"
                    ? "text-green-700"
                    : "text-gray-500"
              }`}
            >
              {change.dir === "up"
                ? "▲"
                : change.dir === "down"
                  ? "▼"
                  : "—"}{" "}
              {change.pct != null
                ? `${numberBn(change.pct)}%`
                : "অপরিবর্তিত"}
            </p>
          </div>
        </section>

        {/* Price summary and market table */}
        <section className="rounded-2xl border border-[#dce6dd] bg-[#fbfdfb] p-4 sm:p-5">
          <h2 className="mb-3 text-base font-bold">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                label: "সর্বনিম্ন দাম",
                price: minPrice,
                color: "text-green-700",
                note: "সবচেয়ে কম দামের বাজার",
              },
              {
                label: "সর্বোচ্চ দাম",
                price: maxPrice,
                color: "text-red-600",
                note: "সবচেয়ে বেশি দামের বাজার",
              },
              {
                label: "গড় দাম",
                price: avgPrice,
                color: "text-green-700",
                note: "প্রতি কেজি/ইউনিট হিসাবে",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[#dce6dd] p-4"
              >
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className={`mt-1 text-xl font-extrabold ${item.color}`}>
                  {numberBn(item.price)} টাকা
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          <h2 className="mb-3 mt-6 text-base font-bold">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {validRows.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-[#dce6dd]">
              <table className="w-full min-w-[620px] text-sm">
                <thead className="bg-[#f8faf8] text-gray-500">
                  <tr>
                    <th className="px-3 py-3 text-left font-medium">
                      বাজার
                    </th>
                    <th className="px-3 py-3 text-left font-medium">
                      বিভাগ
                    </th>
                    <th className="px-3 py-3 text-right font-medium">
                      সর্বনিম্ন
                    </th>
                    <th className="px-3 py-3 text-right font-medium">
                      সর্বাধিক
                    </th>
                    <th className="px-3 py-3 text-right font-medium">
                      গড়
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {validRows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={
                        index % 2 === 0 ? "bg-white" : "bg-[#f0f5f1]"
                      }
                    >
                      <td className="px-3 py-3">{row.name}</td>
                      <td className="px-3 py-3 text-gray-600">
                        {row.division}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {numberBn(row.min)} টাকা
                      </td>
                      <td className="px-3 py-3 text-right">
                        {numberBn(row.max)} টাকা
                      </td>
                      <td className="px-3 py-3 text-right font-semibold">
                        {numberBn(row.avg)} টাকা
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
              API response-এ বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
            </p>
          )}
        </section>

        <Link
          href="/#all-products"
          className="inline-block text-sm font-semibold text-green-700 hover:underline"
        >
          ← সব পণ্যে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
