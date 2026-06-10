export async function shareProduct(payload: {
  title: string;
  slug: string;
  text?: string;
}): Promise<"shared" | "copied"> {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/product/${payload.slug}`
      : `/product/${payload.slug}`;

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: payload.title,
        text: payload.text ?? payload.title,
        url,
      });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
    }
  }

  await navigator.clipboard.writeText(url);
  return "copied";
}
