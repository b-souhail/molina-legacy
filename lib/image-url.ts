const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8081";

export function resolveProductImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) {
    return "/image.png";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads/")) {
    return `${API_BASE}${imageUrl}`;
  }

  return imageUrl;
}
