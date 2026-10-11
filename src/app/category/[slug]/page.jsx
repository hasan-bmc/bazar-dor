
import { Suspense } from "react";
import CategoryContent from "./CategoryContent";

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-[50vh] max-w-7xl px-4 py-10">
          <p className="text-sm text-gray-500">
            ক্যাটাগরি লোড হচ্ছে...
          </p>
        </main>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}
