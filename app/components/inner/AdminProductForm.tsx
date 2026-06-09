"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";

import { CategoryParentAutocomplete } from "@/app/components/inner/CategoryParentAutocomplete";
import type { AdminCategory, ProductPayload } from "@/lib/admin-catalog-api";
import { uploadProductImage } from "@/lib/admin-catalog-api";
import { resolveProductImageUrl } from "@/lib/image-url";

type AdminProductFormProps = {
  categories: AdminCategory[];
  initialValues: ProductPayload;
  submitLabel: string;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  onCancel: () => void;
};

export function AdminProductForm({
  categories,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: AdminProductFormProps) {
  const [form, setForm] = useState<ProductPayload>(initialValues);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = form.imageUrl
    ? resolveProductImageUrl(form.imageUrl)
    : null;

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const url = await uploadProductImage(file);
      setForm((current) => ({ ...current, imageUrl: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) {
      setError("Sélectionnez une catégorie.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border border-(--gold)/20 bg-white p-5 md:grid-cols-2"
    >
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
      <label className="block text-sm text-(--forest) md:col-span-2">
        Description
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="mt-1 w-full border border-(--forest)/15 px-3 py-2"
        />
      </label>
      <label className="block text-sm text-(--forest)">
        Prix (MAD)
        <input
          type="number"
          min={0}
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          required
          className="mt-1 w-full border border-(--forest)/15 px-3 py-2"
        />
      </label>
      <CategoryParentAutocomplete
        categories={categories}
        value={form.categoryId || null}
        onChange={(categoryId) =>
          setForm({ ...form, categoryId: categoryId ?? 0 })
        }
        label="Catégorie"
        placeholder="Ex. Notaire / Sceaux…"
        required
      />
      <div className="md:col-span-2">
        <p className="text-sm text-(--forest)">Image du produit</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
          {previewUrl ? (
            <div className="relative h-32 w-32 shrink-0 overflow-hidden border border-(--forest)/15 bg-(--cream)">
              <Image
                src={previewUrl}
                alt="Aperçu"
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-32 w-32 shrink-0 items-center justify-center border border-dashed border-(--forest)/20 bg-(--cream) text-[10px] uppercase tracking-[0.18em] text-(--sage)">
              Aucune image
            </div>
          )}
          <div className="flex flex-1 flex-col gap-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              disabled={uploading || saving}
              className="block w-full text-sm text-(--forest) file:mr-3 file:border file:border-(--gold)/40 file:bg-(--gold)/10 file:px-3 file:py-2 file:text-[10px] file:uppercase file:tracking-[0.18em] file:text-(--forest)"
            />
            <p className="text-xs text-(--sage)">
              JPEG, PNG, WebP ou GIF — max. 5 Mo. L&apos;image est enregistrée
              sur le serveur.
            </p>
            {form.imageUrl && (
              <p className="break-all text-xs text-(--sage)">{form.imageUrl}</p>
            )}
            {uploading && (
              <p className="text-xs text-(--forest)">Téléversement…</p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 md:col-span-2">{error}</p>
      )}

      <div className="flex gap-3 md:col-span-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="border border-(--gold) bg-(--gold) px-5 py-2 text-[10px] uppercase tracking-[0.22em] text-black disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-(--sage)"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
