
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProductDetailsContent from "./ProductDetailsContent";

async function ProductDetailsAuth({ params }) {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    const callbackURL = `/product/${encodeURIComponent(slug)}`;

    redirect(
      `/sign-in?callbackURL=${encodeURIComponent(callbackURL)}`
    );
  }

  return <ProductDetailsContent slug={slug} />;
}

export default function ProductDetailsPage({ params }) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center bg-[#f0f5f1]">
          <p className="text-sm text-gray-500">
            পণ্যের তথ্য লোড হচ্ছে...
          </p>
        </main>
      }
    >
      <ProductDetailsAuth params={params} />
    </Suspense>
  );
}
