import { Suspense } from "react";
import ProductPageContent from "../ProductPageContent";

type ProductSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductSlugPage({ params }: ProductSlugPageProps) {
  const { slug } = await params;

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
      <ProductPageContent slug={slug} />
    </Suspense>
  );
}
