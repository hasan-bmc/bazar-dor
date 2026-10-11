"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API =
  "https://openapi.programming-hero.com/api/bazardor/products";

function getProducts(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (data?.product && typeof data.product === "object") {
    return [data.product];
  }
  return [];
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return Number(value).toLocaleString("bn-BD");
}

function getPrice(product) {
  return Number(product.today ?? product.price ?? 0);
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const { data: session, isPending } = authClient.useSession();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Login required
  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      const callbackURL = `/product/${encodeURIComponent(slug || "")}`;
      router.replace(
        `/sign-in?callbackURL=${encodeURIComponent(callbackURL)}`
      );
    }
  }, [isPending, session, slug, router]);

  // Fetch product details after authentication
  useEffect(() => {
    if (isPending || !session?.user || !slug) return;

    const controller = new AbortController();

    async function loadProduct() {
      setLoading(true);
      setError("");
      setProduct(null);

      try {
        const url = new URL(API);
        url.searchParams.set("slug", slug);

        const response = await fetch(url.toString(), {
          signal: controller.signal,
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data?.success === false) {
          throw new Error(
            data.message || "পণ্যের তথ্য পাওয়া যায়নি।"
          );
        }

        const items = getProducts(data);
        const matched =
          items.find((item) => item.slug === slug) || items[0];

        if (!matched) {
          throw new Error("এই পণ্যের তথ্য পাওয়া যায়নি।");
        }

        setProduct(matched);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Product details API error:", err);
          setError(
            err.message || "পণ্যের তথ্য লোড করা যায়নি।"
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => controller.abort();
  }, [isPending, session, slug]);

  if (isPending || !session?.user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f0f5f0]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />
          <p className="mt-3 text-sm text-gray-600">
            লগইন যাচাই করা হচ্ছে...
          </p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f0f5f0] px-4 py-8">
        <div className="mx-auto max-w-[1050px] animate-pulse space-y-4">
          <div className="h-24 rounded-xl bg-white" />
          <div className="h-80 rounded-xl bg-white" />
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-[60vh] bg-[#f0f5f0] px-4 py-12 text-center">
        <p className="text-sm text-red-600">
          {error || "পণ্যের তথ্য পাওয়া যায়নি।"}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white"
        >
          আবার চেষ্টা করুন
        </button>

        <div>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-green-800 underline"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const name =
    product.nameBn || product.name || product.slug;

  const icon =
    product.image || product.categoryIcon || "🛒";

  const currentPrice = getPrice(product);
  const change = product.change?.pct ?? 0;
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  const marketPrices = Array.isArray(product.marketPrices)
    ? product.marketPrices
    : Array.isArray(product.prices)
      ? product.prices
      : Array.isArray(product.markets)
        ? product.markets
        : [];

  const prices = marketPrices
    .map((item) =>
      Number(item.price ?? item.today ?? item.amount)
    )
    .filter(Number.isFinite);

  const minPrice = prices.length
    ? Math.min(...prices)
    : currentPrice;

  const maxPrice = prices.length
    ? Math.max(...prices)
    : currentPrice;

  const averagePrice = prices.length
    ? prices.reduce((sum, price) => sum + price, 0) /
      prices.length
    : currentPrice;

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-4 py-5">
      <div className="mx-auto max-w-[1050px]">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-gray-500">
          <Link href="/" className="hover:text-green-800">
            হোম
          </Link>
          <span className="mx-2">›</span>
          <span>{name}</span>
        </nav>

        {/* Product heading */}
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#dce6dd] bg-[#fbfdfb] p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f0f6ef] text-3xl">
              {icon}
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900">
                {name}
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                প্রতি {product.unit || "একক"} · বাজারদরের বিস্তারিত
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {product.categoryNameBn ||
                  product.categoryBn ||
                  product.categoryName ||
                  ""}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#f0f6ef] px-4 py-3">
            <p className="text-[10px] text-gray-500">
              বর্তমান দাম
            </p>
            <p className="text-xl font-bold text-gray-900">
              ৳{formatPrice(currentPrice)}
            </p>
            <p
              className={`text-xs font-semibold ${
                isUp
                  ? "text-red-600"
                  : isDown
                    ? "text-green-700"
                    : "text-gray-500"
              }`}
            >
              {isUp ? "▲" : isDown ? "▼" : "—"} {change}%
            </p>
          </div>
        </section>

        {/* Price summary */}
        <section className="mt-4 rounded-xl border border-[#dce6dd] bg-[#fbfdfb] p-4">
          <h2 className="mb-3 text-sm font-bold text-gray-900">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-[#dce6dd] p-3">
              <p className="text-xs text-gray-500">সর্বনিম্ন দাম</p>
              <p className="mt-1 text-lg font-bold text-green-700">
                ৳{formatPrice(minPrice)}
              </p>
            </div>

            <div className="rounded-xl border border-[#dce6dd] p-3">
              <p className="text-xs text-gray-500">সর্বোচ্চ দাম</p>
              <p className="mt-1 text-lg font-bold text-red-600">
                ৳{formatPrice(maxPrice)}
              </p>
            </div>

            <div className="rounded-xl border border-[#dce6dd] p-3">
              <p className="text-xs text-gray-500">গড় দাম</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                ৳{formatPrice(Math.round(averagePrice))}
              </p>
            </div>
          </div>

          {/* Market table */}
          <h2 className="mb-3 mt-5 text-sm font-bold text-gray-900">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {marketPrices.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-[#dce6dd]">
              <table className="w-full min-w-[580px] text-left text-xs">
                <thead className="bg-[#f6faf6] text-gray-600">
                  <tr>
                    <th className="px-3 py-3 font-semibold">বাজার</th>
                    <th className="px-3 py-3 font-semibold">বিভাগ</th>
                    <th className="px-3 py-3 text-right font-semibold">
                      সর্বনিম্ন
                    </th>
                    <th className="px-3 py-3 text-right font-semibold">
                      সর্বোচ্চ
                    </th>
                    <th className="px-3 py-3 text-right font-semibold">
                      গড়
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {marketPrices.map((item, index) => {
                    const price = Number(
                      item.price ?? item.today ?? item.amount ?? 0
                    );

                    return (
                      <tr
                        key={item.id ?? item.marketId ?? index}
                        className={
                          index % 2 === 0
                            ? "bg-white"
                            : "bg-[#f0f5f0]"
                        }
                      >
                        <td className="px-3 py-3">
                          {item.marketNameBn ||
                            item.marketName ||
                            item.market ||
                            item.nameBn ||
                            item.name ||
                            "স্থানীয় বাজার"}
                        </td>

                        <td className="px-3 py-3">
                          {item.divisionBn ||
                            item.division ||
                            "—"}
                        </td>

                        <td className="px-3 py-3 text-right">
                          ৳{formatPrice(item.minPrice ?? price)}
                        </td>

                        <td className="px-3 py-3 text-right">
                          ৳{formatPrice(item.maxPrice ?? price)}
                        </td>

                        <td className="px-3 py-3 text-right font-semibold">
                          ৳{formatPrice(price)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-lg bg-[#f0f5f0] p-4 text-xs leading-5 text-gray-600">
              API-তে আলাদা বাজারভিত্তিক দামের তালিকা পাওয়া যায়নি।
              বর্তমানে পণ্যের সাধারণ দাম দেখানো হচ্ছে।
            </p>
          )}
        </section>

        <Link
          href={
            product.categorySlug
              ? `/category/${product.categorySlug}`
              : "/"
          }
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:underline"
        >
          ← {product.categoryNameBn || "সব পণ্য"}
        </Link>
      </div>
    </main>
  );
}
