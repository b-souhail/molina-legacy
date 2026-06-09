type CatalogSectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  countLabel?: string;
};

export function CatalogSectionHeading({
  eyebrow,
  title,
  subtitle,
  countLabel,
}: CatalogSectionHeadingProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-3 text-[9px] uppercase tracking-[0.55em] text-(--sage)">
            {eyebrow}
          </p>
        )}
        <h2 className="font-heading text-2xl text-(--forest)">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-[10px] tracking-[0.06em] text-(--sage)">
            {subtitle}
          </p>
        )}
      </div>
      {countLabel && (
        <p className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
          {countLabel}
        </p>
      )}
    </div>
  );
}
