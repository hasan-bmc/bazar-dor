
import Link from "next/link";
import ProductCard from "./ProductCard";

export default function PriceHighlights({ products = [] }) {
  const increased = products
    .filter((product) => product.change?.dir === "up")
    .slice(0, 6);

  const decreased = products
    .filter((product) => product.change?.dir === "down")
    .slice(0, 6);

  if (increased.length === 0 && decreased.length === 0) {
    return null;
  }

  const renderProducts = (items) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((product) => (
        <Link
          key={product.id ?? product.slug}
          href={`/product/${encodeURIComponent(product.slug)}`}
          aria-label={`${product.nameBn || product.name} - বিস্তারিত দেখুন`}
          className="group block min-w-0 rounded-xl outline-none transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
        >
          <ProductCard product={product} />
        </Link>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {increased.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
            <span className="text-red-500" aria-hidden="true">
              ▲
            </span>
            আজ দাম বেড়েছে
          </h2>

          {renderProducts(increased)}
        </section>
      )}

      {decreased.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
            <span className="text-green-600" aria-hidden="true">
              ▼
            </span>
            আজ দাম কমেছে
          </h2>

          {renderProducts(decreased)}
        </section>
      )}
    </div>
  );
}
