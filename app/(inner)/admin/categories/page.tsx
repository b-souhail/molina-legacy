"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { CategoryParentAutocomplete } from "@/app/components/inner/CategoryParentAutocomplete";
import {
  createAdminCategory,
  deleteAdminCategory,
  fetchAdminCategories,
  updateAdminCategory,
  type AdminCategory,
  type CategoryPayload,
} from "@/lib/admin-catalog-api";
import {
  getCategoryPath,
  isProfession,
} from "@/lib/admin-catalog-utils";

const emptyForm = {
  name: "",
  slug: "",
  parentId: null as number | null,
};

export default function AdminCategoriesPage() {
  const [allCategories, setAllCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const categories = useMemo(
    () => allCategories.filter((category) => !isProfession(category)),
    [allCategories]
  );

  const load = () => {
    setLoading(true);
    fetchAdminCategories()
      .then(setAllCategories)
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

  const openEdit = (category: AdminCategory) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId ?? null,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.parentId == null) {
      setError("Sélectionnez une catégorie parente.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload: CategoryPayload = {
      name: form.name,
      slug: form.slug || undefined,
      parentId: form.parentId,
    };

    try {
      if (editingId) {
        await updateAdminCategory(editingId, payload);
      } else {
        await createAdminCategory(payload);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try {
      await deleteAdminCategory(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-(--forest)">Catégories</h1>
          <p className="mt-1 text-sm text-(--sage)">
            Sous-catégories rattachées à une profession ou à une catégorie
            existante.{" "}
            <Link href="/admin/professions" className="underline hover:text-(--forest)">
              Gérer les professions
            </Link>
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 border border-(--gold) bg-(--gold) px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-black"
        >
          <Plus size={14} />
          Nouvelle catégorie
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-lg border border-(--gold)/20 bg-white p-5 md:grid-cols-2"
        >
          <CategoryParentAutocomplete
            categories={allCategories}
            value={form.parentId}
            onChange={(parentId) => setForm({ ...form, parentId })}
            excludeId={editingId ?? undefined}
            required
            label="Catégorie parente"
            placeholder="Ex. Notaire, Architecte / Pins…"
          />

          <label className="block text-sm text-(--forest)">
            Nom
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="mt-1 w-full border border-(--forest)/15 px-3 py-2"
            />
          </label>
          <label className="block text-sm text-(--forest)">
            Slug
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="auto si vide"
              className="mt-1 w-full border border-(--forest)/15 px-3 py-2"
            />
          </label>

          <div className="flex gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="border border-(--gold) bg-(--gold) px-5 py-2 text-[10px] uppercase tracking-[0.22em] text-black"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-(--sage)"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-(--gold)/20 bg-white">
        <table className="min-w-full text-sm">
          <thead className="border-b border-(--gold)/15 text-left text-(--sage)">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Parent</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-(--sage)">
                  Chargement…
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-(--sage)">
                  Aucune catégorie. Créez d&apos;abord une profession.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-b border-(--gold)/10">
                  <td className="px-4 py-3 font-medium text-(--forest)">
                    {category.name}
                  </td>
                  <td className="px-4 py-3 text-(--sage)">{category.slug}</td>
                  <td className="px-4 py-3 text-(--sage)">
                    {category.parentId
                      ? (() => {
                          const parent = allCategories.find(
                            (item) => item.id === category.parentId
                          );
                          return parent
                            ? getCategoryPath(parent, allCategories)
                            : (category.parentName ?? "—");
                        })()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(category)}
                        className="text-(--sage) hover:text-(--forest)"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
                        className="text-(--sage) hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
