"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function LegacyProductRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  useEffect(() => {
    if (slug) {
      router.replace(`/product/${encodeURIComponent(slug)}`);
      return;
    }
    router.replace("/collections");
  }, [slug, router]);

  return (
    <main className="min-h-screen bg-(--cream) flex items-center justify-center">
      <p className="text-sm uppercase tracking-[0.2em] text-(--sage)">
        Redirection…
      </p>
    </main>
  );
}

export default function LegacyProductPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-(--cream) flex items-center justify-center">
          <p className="text-sm uppercase tracking-[0.2em] text-(--sage)">
            Chargement…
          </p>
        </main>
      }
    >
      <LegacyProductRedirect />
    </Suspense>
  );
}
