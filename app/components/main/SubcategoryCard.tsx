import Link from "next/link";

import { categoryAbbr } from "@/lib/categories-api";

type SubcategoryCardProps = {
  name: string;
  slug: string;
};

export function SubcategoryCard({ name, slug }: SubcategoryCardProps) {
  return (
    <Link
      href={`/collections/${slug}`}
      className="group relative flex flex-col items-center gap-3 border border-(--gold)/20 bg-(--cream) px-6 py-8 transition-all duration-300 hover:border-(--gold)/50 hover:shadow-[0_8px_28px_rgba(17,22,19,0.08)]"
    >
      <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-(--gold)/40" />
      <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-(--gold)/40" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-(--gold)/40" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-(--gold)/40" />

      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-(--forest)/15 bg-(--cream) text-sm font-semibold tracking-[0.14em] text-(--forest) transition-transform duration-300 group-hover:scale-105">
        {categoryAbbr(name)}
      </div>

      <p className="text-center text-[10px] uppercase tracking-[0.18em] text-(--forest)/75 transition-colors group-hover:text-(--forest)">
        {name}
      </p>
    </Link>
  );
}
