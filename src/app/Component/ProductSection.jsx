"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

export default function ProductSection({ products = [] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const map = new Map();

    products.forEach((product) => {
      const category = product.categoryNameBn ||
        product.categoryBn ||
        product.category;

      if (category) {
        map.set(category, category);
      }
    });

    return [...map.values()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const name =
        product.nameBn || product.name || "";

      const category =
        product.categoryNameBn ||
        product.categoryBn ||
        product.category ||
        "";

      const matchesSearch = name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  return (
    <section id="all-products" className="scroll-mt-24">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            সব পণ্য
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            প্রতিদিনের প্রয়োজনীয় পণ্যের বাজারদর
          </p>
        </div>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="পণ্যের নাম লিখুন..."
          aria-label="পণ্য খুঁজুন"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-600 sm:max-w-56"
        />
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium ${
            selectedCategory === "all"
              ? "border-green-700 bg-green-700 text-white"
              : "border-gray-200 bg-white text-gray-700 hover:bg-green-50"
          }`}
        >
          সব ক্যাটাগরি
        </button>

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium ${
              selectedCategory === category
                ? "border-green-700 bg-green-700 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-green-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id ?? product.slug}
              href={`/product/${product.slug}`}
              className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-2xl">🔎</p>
          <p className="mt-2 text-sm font-semibold text-gray-700">
            কোনো পণ্য পাওয়া যায়নি
          </p>
          <p className="mt-1 text-xs text-gray-500">
            অন্য নাম বা ক্যাটাগরি দিয়ে খুঁজে দেখুন।
          </p>
        </div>
      )}
    </section>
  );
}
