"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API =
  "https://openapi.programming-hero.com/api/bazardor/products";

const CATEGORIES_API =
  "https://openapi.programming-hero.com/api/bazardor/categories";

function getProducts(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getCategories(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getProductName(product) {
  return product.nameBn || product.name || product.slug || "পণ্য";
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    async function loadData() {
      setLoading(true);
      setError(false);
      setProducts([]);

      try {
        const productUrl = new URL(API);
        productUrl.searchParams.set("category", slug);

        const [productResponse, categoryResponse] =
          await Promise.all([
            fetch(productUrl.toString(), {
              signal: controller.signal,
              cache: "no-store",
              headers: { Accept: "application/json" },
            }),
            fetch(CATEGORIES_API, {
              signal: controller.signal,
              cache: "no-store",
              headers: { Accept: "application/json" },
            }),
          ]);

        if (!productResponse.ok) {
          throw new Error(
            `Products API failed: ${productResponse.status}`
          );
        }

        if (!categoryResponse.ok) {
          throw new Error(
            `Categories API failed: ${categoryResponse.status}`
          );
        }

        const [productData, categoryData] = await Promise.all([
          productResponse.json(),
          categoryResponse.json(),
        ]);

        if (productData?.success === false) {
          throw new Error(
            productData.message || "Products API returned an error"
          );
        }

        setProducts(getProducts(productData));
        setCategories(getCategories(categoryData));
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Category page API error:", err);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => controller.abort();
  }, [slug]);

  const category = categories.find(
    (item) => item.slug === slug
  );

  const categoryName =
    category?.nameBn ||
    category?.categoryNameBn ||
    category?.name ||
    category?.categoryName ||
    slug ||
    "পণ্য";

  const categoryIcon =
    category?.icon || category?.categoryIcon || "🛒";

  const categoryProducts = useMemo(() => {
    const sorted = [...products];

    if (sort === "price-low") {
      sorted.sort(
        (a, b) => Number(a.today ?? 0) - Number(b.today ?? 0)
      );
    } else if (sort === "price-high") {
      sorted.sort(
        (a, b) => Number(b.today ?? 0) - Number(a.today ?? 0)
      );
    } else if (sort === "name") {
      sorted.sort((a, b) =>
        getProductName(a).localeCompare(getProductName(b), "bn")
      );
    }

    return sorted;
  }, [products, sort]);

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-[#f0f5f0] px-4 py-8">
        <div className="mx-auto max-w-[934px]">
          <div className="h-20 animate-pulse rounded-2xl bg-white" />

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[60vh] bg-[#f0f5f0] px-4 py-12 text-center">
        <p className="text-sm text-red-600">
          ক্যাটাগরির পণ্য লোড করা যায়নি।
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
        >
          আবার চেষ্টা করুন
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-4 py-5">
      <div className="mx-auto max-w-[934px]">
        {/* Category heading */}
        <section className="flex items-center gap-4 rounded-2xl border border-[#dce6dd] bg-[#fbfdfb] p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f6ef] text-3xl">
            {categoryIcon}
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900">
              {categoryName}
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              {categoryProducts.length}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </section>

        {/* Results and sorting */}
        <div className="mb-4 mt-6 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-600 sm:text-sm">
            মোট {categoryProducts.length}টি পণ্য দেখানো হচ্ছে
          </p>

          <label className="flex shrink-0 items-center gap-2 text-xs text-gray-600">
            সাজান

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-xs outline-none focus:border-green-600"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-low">দাম: কম থেকে বেশি</option>
              <option value="price-high">দাম: বেশি থেকে কম</option>
              <option value="name">নাম অনুযায়ী</option>
            </select>
          </label>
        </div>

        {/* Product grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map((product) => {
              const isUp = product.change?.dir === "up";
              const isDown = product.change?.dir === "down";

              return (
                <Link
                  key={product.id ?? product.slug}
                  href={`/product/${product.slug}`}
                  className="rounded-2xl border border-[#dce6dd] bg-[#fbfdfb] p-4 transition hover:border-green-600 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f6ef] text-2xl">
                      {product.image || categoryIcon}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-bold text-gray-900">
                        {getProductName(product)}
                      </h2>

                      <p className="mt-0.5 text-[10px] text-gray-500">
                        প্রতি {product.unit || "একক"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-gray-500">
                        আজকের দাম
                      </p>

                      <p className="mt-1 text-base font-bold text-gray-900">
                        ৳{product.today ?? "—"}{" "}
                        <span className="text-xs font-normal">
                          টাকা
                        </span>
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
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
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-3xl">{categoryIcon}</p>

            <p className="mt-3 text-sm font-semibold text-gray-700">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            </p>

            <p className="mt-1 text-xs text-gray-500">
              API-এর response structure এবং category parameter যাচাই করুন।
            </p>

            <Link
              href="/"
              className="mt-4 inline-block text-sm font-semibold text-green-700 underline"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
