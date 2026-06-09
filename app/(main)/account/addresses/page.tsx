"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  updateAddress,
  type UserAddress,
} from "@/lib/account-api";

const emptyForm = {
  label: "",
  address: "",
  city: "",
  postalCode: "",
  defaultAddress: false,
};

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAddresses()
      .then(setAddresses)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de chargement")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (address: UserAddress) => {
    setEditingId(address.id);
    setForm({
      label: address.label ?? "",
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      defaultAddress: address.defaultAddress,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateAddress(editingId, form);
      } else {
        await createAddress(form);
      }
      setShowForm(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette adresse ?")) return;
    try {
      await deleteAddress(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (loading) {
    return <p className="text-sm text-(--sage)">Chargement…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-(--sage)">
          {addresses.length} adresse{addresses.length > 1 ? "s" : ""} enregistrée
          {addresses.length > 1 ? "s" : ""}
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 border border-(--forest)/20 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-(--forest)"
        >
          <Plus size={14} />
          Ajouter
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 border border-(--gold)/20 bg-white/60 p-5"
        >
          <h2 className="font-heading text-xl text-(--forest)">
            {editingId ? "Modifier l'adresse" : "Nouvelle adresse"}
          </h2>
          <label className="block text-sm text-(--forest)">
            Libellé
            <input
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="Maison, Bureau…"
              className="mt-1 w-full border border-(--forest)/15 bg-white px-3 py-2.5"
            />
          </label>
          <label className="block text-sm text-(--forest)">
            Adresse
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
              className="mt-1 w-full border border-(--forest)/15 bg-white px-3 py-2.5"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-(--forest)">
              Ville
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
                className="mt-1 w-full border border-(--forest)/15 bg-white px-3 py-2.5"
              />
            </label>
            <label className="block text-sm text-(--forest)">
              Code postal
              <input
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
                required
                className="mt-1 w-full border border-(--forest)/15 bg-white px-3 py-2.5"
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-(--forest)">
            <input
              type="checkbox"
              checked={form.defaultAddress}
              onChange={(e) =>
                setForm({ ...form, defaultAddress: e.target.checked })
              }
            />
            Adresse par défaut
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="border border-(--gold) bg-(--gold) px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] text-black"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 text-sm text-(--sage)"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="border border-(--gold)/20 bg-white/50 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-(--sage)">
                  {address.label || "Adresse"}
                  {address.defaultAddress && " · Par défaut"}
                </p>
                <p className="mt-2 text-sm text-(--forest)">{address.address}</p>
                <p className="text-sm text-(--sage)">
                  {address.city} {address.postalCode}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(address)}
                  className="text-(--sage) hover:text-(--forest)"
                  aria-label="Modifier"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  className="text-(--sage) hover:text-red-600"
                  aria-label="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
