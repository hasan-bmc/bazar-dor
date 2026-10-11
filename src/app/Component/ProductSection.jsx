
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

export default function ProductSection({ products = [] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const categories = useMemo(() => {
    const map = new Map();

    products.forEach((product) => {
      const category =
        product.categoryNameBn ||
        product.categoryBn ||
        product.category;

      if (category) {
        map.set(category, category);
      }
    });

    return [...map.values()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    const result = products.filter((product) => {
      const name = (
        product.nameBn ||
        product.name ||
        ""
      ).toLocaleLowerCase();

      const category =
        product.categoryNameBn ||
        product.categoryBn ||
        product.category ||
        "";

      const matchesSearch =
        name.includes(query) ||
        (product.name || "").toLocaleLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "all" ||
        category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    const getPrice = (product) => {
      const price = Number(product.today);
      return Number.isFinite(price) ? price : 0;
    };

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => getPrice(a) - getPrice(b));
        break;

      case "price-high":
        result.sort((a, b) => getPrice(b) - getPrice(a));
        break;

      case "name":
        result.sort((a, b) =>
          (a.nameBn || a.name || "").localeCompare(
            b.nameBn || b.name || "",
            "bn"
          )
        );
        break;

      default:
        break;
    }

    return result;
  }, [products, search, selectedCategory, sortBy]);

  return (
    <section
      id="all-products"
      className="scroll-mt-24 space-y-5"
    >
      {/* Heading and sorting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-950 sm:text-2xl">
            সব পণ্য
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            মোট {filteredProducts.length}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label
            htmlFor="product-sort"
            className="shrink-0 text-sm text-gray-600"
          >
            সাজান
          </label>

          <select
            id="product-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="max-w-[190px] rounded-xl border border-gray-300 bg-[#fbfdfb] px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/10"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-low">দাম: কম থেকে বেশি</option>
            <option value="price-high">দাম: বেশি থেকে কম</option>
            <option value="name">নাম অনুযায়ী</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="পণ্যের নাম লিখে খুঁজুন..."
          aria-label="পণ্য খুঁজুন"
          className="w-full rounded-xl border border-[#dce5dd] bg-[#fbfdfb] py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/10"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`shrink-0 rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
            selectedCategory === "all"
              ? "border-green-700 bg-green-700 text-white"
              : "border-[#dce5dd] bg-[#fbfdfb] text-gray-700 hover:border-green-600 hover:text-green-700"
          }`}
        >
          সব ক্যাটাগরি
        </button>

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`shrink-0 rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
              selectedCategory === category
                ? "border-green-700 bg-green-700 text-white"
                : "border-[#dce5dd] bg-[#fbfdfb] text-gray-700 hover:border-green-600 hover:text-green-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <Link
              key={product.id ?? product.slug ?? index}
              href={`/product/${encodeURIComponent(product.slug)}`}
              aria-label={`${product.nameBn || product.name || "পণ্য"} বিস্তারিত দেখুন`}
              className="block min-w-0 rounded-xl outline-none transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#cfdad1] bg-[#fbfdfb] px-5 py-14 text-center">
          <div className="text-4xl" aria-hidden="true">
            🔎
          </div>

          <h3 className="mt-3 font-bold text-gray-800">
            কোনো পণ্য পাওয়া যায়নি
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            অন্য নাম বা ক্যাটাগরি দিয়ে খুঁজে দেখুন।
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setSortBy("default");
            }}
            className="mt-4 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
          >
            সব পণ্য দেখুন
          </button>
        </div>
      )}
    </section>
  );
}
