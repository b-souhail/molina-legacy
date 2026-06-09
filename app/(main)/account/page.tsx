"use client";

import { FormEvent, useEffect, useState } from "react";

import { fetchProfile, updateProfile } from "@/lib/account-api";
import { useAuth } from "@/lib/auth-context";

export default function AccountProfilePage() {
  const { refreshUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile()
      .then((profile) => {
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setEmail(profile.email);
        setTel(profile.tel ?? "");
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de chargement")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await updateProfile({ firstName, lastName, email, tel: tel || undefined });
      await refreshUser();
      setMessage("Profil mis à jour.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-(--sage)">Chargement…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-(--forest)">
          Prénom
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1 w-full border border-(--forest)/15 bg-white px-3 py-2.5"
          />
        </label>
        <label className="block text-sm text-(--forest)">
          Nom
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mt-1 w-full border border-(--forest)/15 bg-white px-3 py-2.5"
          />
        </label>
      </div>
      <label className="block text-sm text-(--forest)">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full border border-(--forest)/15 bg-white px-3 py-2.5"
        />
      </label>
      <label className="block text-sm text-(--forest)">
        Téléphone
        <input
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          className="mt-1 w-full border border-(--forest)/15 bg-white px-3 py-2.5"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-(--sage)">{message}</p>}

      <button
        type="submit"
        disabled={saving}
        className="border border-(--gold) bg-(--gold) px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-black disabled:opacity-50"
      >
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
