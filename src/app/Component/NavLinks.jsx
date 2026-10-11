"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

const API =
  "https://openapi.programming-hero.com/api/bazardor/categories";

function parseCategories(data) {
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    if (Array.isArray(data.categories)) return data.categories;
    if (Array.isArray(data.data)) return data.data;
  }

  return [];
}

function NavLinksContent() {
  const pathname = usePathname();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      try {
        const response = await fetch(API, {
          signal: controller.signal,
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        setCategories(
          parseCategories(data).filter((category) => category?.slug)
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

  if (loading) {
    return (
      <div className="flex gap-2 overflow-hidden py-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="h-8 w-16 shrink-0 animate-pulse rounded-lg bg-green-100"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-2 text-xs text-red-600">
        ক্যাটাগরি লোড করা যায়নি।
      </p>
    );
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1.5 sm:gap-2">
      {categories.map((category) => {
        const href = `/category/${encodeURIComponent(category.slug)}`;
        const active =
          pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={category.id ?? category.slug}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? "border-green-700 bg-green-700 text-white"
                : "border-transparent text-gray-700 hover:bg-green-50 hover:text-green-800"
            }`}
          >
            <span>
              {category.icon || category.categoryIcon || "🛒"}
            </span>

            <span>
              {category.nameBn ||
                category.categoryNameBn ||
                category.name ||
                category.slug}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default function NavLinks() {
  return (
    <nav
      aria-label="পণ্য ক্যাটাগরি"
      className="border-y border-gray-100 bg-[#f9fcf9]"
    >
      <div className="mx-auto max-w-[1420px] px-4 sm:px-8 lg:px-10">
        <Suspense
          fallback={
            <div className="h-10 animate-pulse bg-green-50" />
          }
        >
          <NavLinksContent />
        </Suspense>
      </div>
    </nav>
  );
}
