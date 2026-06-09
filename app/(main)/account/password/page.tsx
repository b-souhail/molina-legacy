"use client";

import { FormEvent, useState } from "react";

import { changePassword } from "@/lib/account-api";

export default function AccountPasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await changePassword({ oldPassword, newPassword, matchPassword });
      setOldPassword("");
      setNewPassword("");
      setMatchPassword("");
      setMessage("Mot de passe mis à jour.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <label className="block text-sm text-(--forest)">
        Ancien mot de passe
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          className="mt-1 w-full border border-(--forest)/15 bg-white px-3 py-2.5"
        />
      </label>
      <label className="block text-sm text-(--forest)">
        Nouveau mot de passe
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="mt-1 w-full border border-(--forest)/15 bg-white px-3 py-2.5"
        />
      </label>
      <label className="block text-sm text-(--forest)">
        Confirmer le mot de passe
        <input
          type="password"
          value={matchPassword}
          onChange={(e) => setMatchPassword(e.target.value)}
          required
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
        {saving ? "Mise à jour…" : "Changer le mot de passe"}
      </button>
    </form>
  );
}
