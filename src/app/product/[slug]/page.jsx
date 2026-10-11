
import { Suspense } from "react";
import ProductDetailsContent from "./ProductDetailsContent";

export default function ProductDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center bg-[#f0f5f1] px-4">
          <p className="text-sm text-gray-600">
            পণ্যের বিস্তারিত লোড হচ্ছে...
          </p>
        </main>
      }
    >
      <ProductDetailsContent />
    </Suspense>
  );
}
