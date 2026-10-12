
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "../../Component/ProductCard";

const API =
  "https://openapi.programming-hero.com/api/bazardor/products";

function getProducts(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.product)) return data.product;
  return [];
}

function getPrice(product) {
  const value =
    product?.today?.price ??
    product?.todayPrice ??
    product?.price ??
    product?.currentPrice ??
    product?.today ??
    0;

  if (typeof value === "number") return value;

  const englishValue = String(value).replace(/[০-৯]/g, (digit) =>
    String("০১২৩৪৫৬৭৮৯".indexOf(digit))
  );

  const price = Number(englishValue.replace(/[^\d.]/g, ""));
  return Number.isFinite(price) ? price : 0;
}

export default function CategoryContent() {
  const params = useParams();
  const slug = params?.slug;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const url = new URL(API);
        url.searchParams.set("category", slug);

        const response = await fetch(url, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
        }

        const data = await response.json();
        setProducts(getProducts(data));
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

    loadProducts();

    return () => controller.abort();
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "asc") {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sort === "desc") {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    }

    return result;
  }, [products, sort]);

  if (loading) {
    return (
      <main className="mx-auto min-h-[50vh] w-full max-w-[1420px] px-4 py-8 sm:px-8 lg:px-10">
        <div className="mb-6 h-[90px] animate-pulse rounded-2xl bg-white" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[130px] animate-pulse rounded-2xl border border-gray-100 bg-white"
            />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto min-h-[50vh] w-full max-w-[1420px] px-4 py-8 sm:px-8 lg:px-10">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm text-white"
        >
          আবার চেষ্টা করুন
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[50vh] w-full max-w-[1420px] px-4 py-6 sm:px-8 lg:px-10">
      {/* Category header — preserve existing design */}
      <section className="mb-6 flex items-center gap-4 rounded-2xl border border-[#dce7dc] bg-white/80 p-4 sm:p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-2xl">
          🍚
        </span>

        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {slug === "chal" ? "চাল" : "ক্যাটাগরির পণ্য"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </section>

      {/* Count and sorting */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          মোট {products.length}টি পণ্য দেখানো হচ্ছে
        </p>

        <label className="flex shrink-0 items-center gap-2 text-sm text-gray-600">
          <span>সাজান</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-green-600"
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {sortedProducts.map((product, index) => (
            <Link
              key={product.id ?? product.slug ?? index}
              href={
                product.slug
                  ? `/product/${encodeURIComponent(product.slug)}`
                  : "#"
              }
              className="block min-w-0 rounded-xl focus-visible:outline-2 focus-visible:outline-green-600"
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="font-semibold text-gray-800">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      )}
    </main>
  );
}
