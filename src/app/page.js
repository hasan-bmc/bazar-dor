"use client";

import { useEffect, useState } from "react";
import HeroSection from "./Component/HeroSection";
import PriceHighlights from "./Component/PriceHighlights";
import ProductSection from "./Component/ProductSection";

const API =
  "https://openapi.programming-hero.com/api/bazardor/products";

function parseProducts(data) {
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.data)) return data.data;
  }

  return [];
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setProducts(parseProducts(data));
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Products API error:", err);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-[#f0f5f0]">
      <div className="mx-auto max-w-[1420px] space-y-6 px-4 py-5 sm:px-6 lg:px-8">
        <HeroSection />

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-white p-6 text-center">
            <p className="text-sm text-red-600">
              পণ্যের তথ্য লোড করা যায়নি।
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : (
          <>
            <PriceHighlights products={products} />
            <ProductSection products={products} />
          </>
        )}
      </div>
    </main>
  );
}
