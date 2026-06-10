"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/lib/auth-context";

export default function LegacyFactureRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const orderId = params.orderId;

  useEffect(() => {
    if (loading || !orderId) {
      return;
    }

    const target = `/account/orders/${orderId}/facture`;

    if (user) {
      router.replace(target);
      return;
    }

    router.replace(
      `/auth/login?redirect=${encodeURIComponent(target)}`
    );
  }, [loading, user, orderId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--cream) text-sm text-(--sage)">
      Redirection…
    </div>
  );
}
