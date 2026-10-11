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

  return (
    <div className="space-y-6">
      {increased.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold text-gray-900">
            <span className="text-red-500">▲</span> আজ দাম বেড়েছে
          </h2>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-6">
            {increased.map((product) => (
              <ProductCard
                key={product.id ?? product.slug}
                product={product}
              />
            ))}
          </div>
        </section>
      )}

      {decreased.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold text-gray-900">
            <span className="text-green-600">▼</span> আজ দাম কমেছে
          </h2>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-6">
            {decreased.map((product) => (
              <ProductCard
                key={product.id ?? product.slug}
                product={product}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
