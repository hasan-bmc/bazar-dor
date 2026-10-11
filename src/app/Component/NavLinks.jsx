"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const API =
  "https://openapi.programming-hero.com/api/bazardor/categories";

function parseCategories(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    if (Array.isArray(data.categories)) {
      return data.categories;
    }

    if (Array.isArray(data.data)) {
      return data.data;
    }
  }

  return [];
}

export default function NavLinks() {
  const pathname = usePathname();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      try {
        const response = await fetch(API, {
          cache: "no-store",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const items = parseCategories(data);

        setCategories(
          items.filter((category) => Boolean(category?.slug))
        );
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Categories API error:", err);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => controller.abort();
  }, []);

  return (
    <nav
      aria-label="পণ্য ক্যাটাগরি"
      className="border-y border-gray-100 bg-[#f9fcf9]"
    >
      <div className="mx-auto max-w-[1420px] px-4 sm:px-8 lg:px-10">
        <div className="flex items-center gap-1 overflow-x-auto py-2 sm:gap-2">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-9 w-20 shrink-0 animate-pulse rounded-xl bg-green-100"
              />
            ))
          ) : error ? (
            <p className="py-2 text-sm text-red-600">
              ক্যাটাগরি লোড করা যায়নি।
            </p>
          ) : categories.length > 0 ? (
            categories.map((category) => {
              const href = `/category/${category.slug}`;

              const active =
                pathname === href ||
                pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={category.id ?? category.slug}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium whitespace-nowrap transition sm:px-4 ${
                    active
                      ? "border-green-700 bg-green-700 text-white shadow-sm"
                      : "border-transparent text-gray-700 hover:bg-[#e5f4e9] hover:text-green-800"
                  }`}
                >
                  <span className="text-base">
                    {category.icon ||
                      category.categoryIcon ||
                      "🛒"}
                  </span>

                  <span>
                    {category.nameBn ||
                      category.categoryNameBn ||
                      category.name ||
                      category.slug}
                  </span>
                </Link>
              );
            })
          ) : (
            <p className="py-2 text-sm text-gray-500">
              কোনো ক্যাটাগরি পাওয়া যায়নি।
            </p>
          )}
        </div>
      </div>
    </nav>
  );
}
