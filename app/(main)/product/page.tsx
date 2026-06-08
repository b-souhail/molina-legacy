import { Suspense } from "react";
import ProductPageContent from "./ProductPageContent";

export default function ProductPage() {
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
      <ProductPageContent />
    </Suspense>
  );
}
