export function productPath(slug: string) {
  return `/product/${encodeURIComponent(slug)}`;
}
