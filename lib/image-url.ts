export function resolveProductImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) {
    return "/assets/images/p1.png";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  return `/${imageUrl}`;
}
