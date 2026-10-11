
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "../../Component/ProductCard";
import Link from "next/link";

const API =
  "https://openapi.programming-hero.com/api/bazardor/products";

function getProducts(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.product)) return data.product;
  return [];
}

export default function CategoryContent() {
  const params = useParams();
  const slug = params?.slug;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        });

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
        }

        const data = await response.json();
        setProducts(getProducts(data));
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "একটি সমস্যা হয়েছে।");
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

  if (loading) {
    return (
      <main className="mx-auto min-h-[50vh] max-w-7xl px-4 py-10">
        <p className="text-sm text-gray-500">
          পণ্য লোড হচ্ছে...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto min-h-[50vh] max-w-7xl px-4 py-10">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-white"
        >
          আবার চেষ্টা করুন
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[50vh] max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ক্যাটাগরির পণ্য
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            মোট {products.length}টি পণ্য
          </p>
        </div>

        <Link
          href="/"
          className="text-sm font-semibold text-green-700 hover:underline"
        >
          হোম পেজ
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Link
              key={product.id ?? product.slug ?? index}
              href={`/product/${encodeURIComponent(product.slug)}`}
              className="block min-w-0 rounded-xl focus-visible:outline-2 focus-visible:outline-green-600"
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="font-semibold text-gray-800">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
          </p>
        </div>
      )}
    </main>
  );
}
