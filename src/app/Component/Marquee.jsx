"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API =
  "https://openapi.programming-hero.com/api/bazardor/products";

export default function Marquee() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const response = await fetch(API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        const result = Array.isArray(data)
          ? data
          : data &&
              typeof data === "object" &&
              Array.isArray(data.products)
            ? data.products
            : data &&
                typeof data === "object" &&
                Array.isArray(data.data)
              ? data.data
              : [];

        setProducts(result);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Marquee API error:", error);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="w-full overflow-hidden border-y border-green-100 bg-white">
      <div className="flex items-stretch">
        <div className="group min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max animate-[marquee_45s_linear_infinite] motion-reduce:animate-none group-hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center"
              >
                {products.map((product) => {
                  const isUp = product.change?.dir === "up";
                  const isDown = product.change?.dir === "down";

                  return (
                    <Link
                      key={`${copy}-${product.id ?? product.slug}`}
                      href={`/product/${product.slug}`}
                      tabIndex={copy === 1 ? -1 : undefined}
                      className="flex shrink-0 items-center gap-2 border-r border-gray-100 px-4 py-3 transition-colors hover:bg-green-50"
                    >
                      <span className="text-lg">
                        {product.image ||
                          product.categoryIcon ||
                          "🛒"}
                      </span>

                      <span className="whitespace-nowrap text-sm font-medium text-gray-700">
                        {product.nameBn || product.name || product.slug}
                      </span>

                      <span className="whitespace-nowrap text-sm font-bold text-green-800">
                        ৳{product.today ?? "—"}
                        <span className="ml-1 text-xs font-normal text-gray-500">
                          /{product.unit || "একক"}
                        </span>
                      </span>

                      <span
                        className={`whitespace-nowrap text-xs font-semibold ${
                          isUp
                            ? "text-red-600"
                            : isDown
                              ? "text-green-700"
                              : "text-gray-500"
                        }`}
                      >
                        {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                        {product.change?.pct ?? 0}%
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
