"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { Star, Trash2 } from "lucide-react";

import { CategoryParentAutocomplete } from "@/app/components/inner/CategoryParentAutocomplete";
import type {
  AdminCategory,
  ProductImagePayload,
  ProductOptionPayload,
  ProductPayload,
} from "@/lib/admin-catalog-api";
import { uploadProductImage } from "@/lib/admin-catalog-api";
import { resolveProductImageUrl } from "@/lib/image-url";

type AdminProductFormProps = {
  categories: AdminCategory[];
  initialValues: ProductPayload;
  submitLabel: string;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  onCancel: () => void;
};

function emptyOption(): ProductOptionPayload {
  return { name: "", value: "", priceAdjustment: 0 };
}

export function AdminProductForm({
  categories,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: AdminProductFormProps) {
  const [form, setForm] = useState<ProductPayload>({
    ...initialValues,
    images: initialValues.images ?? [],
    options: initialValues.options ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const images = form.images ?? [];
  const options = form.options ?? [];

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const uploaded: ProductImagePayload[] = [];
      for (const file of files) {
        const url = await uploadProductImage(file);
        uploaded.push({
          url,
          principal: images.length === 0 && uploaded.length === 0,
          sortOrder: images.length + uploaded.length,
        });
      }
      setForm((current) => ({
        ...current,
        images: [...(current.images ?? []), ...uploaded],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const setPrimaryImage = (index: number) => {
    setForm((current) => ({
      ...current,
      images: (current.images ?? []).map((image, imageIndex) => ({
        ...image,
        principal: imageIndex === index,
        sortOrder: imageIndex,
      })),
    }));
  };

  const removeImage = (index: number) => {
    setForm((current) => {
      const nextImages = (current.images ?? []).filter((_, i) => i !== index);
      if (nextImages.length > 0 && !nextImages.some((image) => image.principal)) {
        nextImages[0] = { ...nextImages[0], principal: true };
      }
      return {
        ...current,
        images: nextImages.map((image, imageIndex) => ({
          ...image,
          sortOrder: imageIndex,
        })),
      };
    });
  };

  const updateOption = (
    index: number,
    field: keyof ProductOptionPayload,
    value: string | number
  ) => {
    setForm((current) => ({
      ...current,
      options: (current.options ?? []).map((option, optionIndex) =>
        optionIndex === index ? { ...option, [field]: value } : option
      ),
    }));
  };

  const addOption = () => {
    setForm((current) => ({
      ...current,
      options: [...(current.options ?? []), emptyOption()],
    }));
  };

  const removeOption = (index: number) => {
    setForm((current) => ({
      ...current,
      options: (current.options ?? []).filter((_, optionIndex) => optionIndex !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) {
      setError("Sélectionnez une catégorie.");
      return;
    }

    const validOptions = options.filter(
      (option) => option.name.trim() && option.value.trim()
    );

    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        ...form,
        images: images.map((image, index) => ({
          ...image,
          sortOrder: index,
        })),
        options: validOptions,
        imageUrl: undefined,
      });
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
        Prix de base (MAD)
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
        <p className="text-sm text-(--forest)">Images du produit</p>
        <p className="mt-1 text-xs text-(--sage)">
          Ajoutez plusieurs images et définissez l&apos;image principale.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="relative h-28 w-28 overflow-hidden border border-(--forest)/15 bg-(--cream)"
            >
              <Image
                src={resolveProductImageUrl(image.url)}
                alt={`Image ${index + 1}`}
                fill
                sizes="112px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/55 p-1">
                <button
                  type="button"
                  onClick={() => setPrimaryImage(index)}
                  className={`flex flex-1 items-center justify-center py-1 ${
                    image.principal ? "text-(--gold)" : "text-white/70"
                  }`}
                  title="Définir comme principale"
                >
                  <Star size={14} fill={image.principal ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="flex flex-1 items-center justify-center py-1 text-white/80 hover:text-red-300"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleImageUpload}
          disabled={uploading || saving}
          className="mt-3 block w-full text-sm text-(--forest) file:mr-3 file:border file:border-(--gold)/40 file:bg-(--gold)/10 file:px-3 file:py-2 file:text-[10px] file:uppercase file:tracking-[0.18em] file:text-(--forest)"
        />
        {uploading && (
          <p className="mt-2 text-xs text-(--forest)">Téléversement…</p>
        )}
      </div>

      <div className="md:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-(--forest)">Options du produit</p>
            <p className="mt-1 text-xs text-(--sage)">
              Ex. Taille, Finition — avec ajustement de prix optionnel.
            </p>
          </div>
          <button
            type="button"
            onClick={addOption}
            className="border border-(--forest)/20 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-(--forest) hover:border-(--forest)"
          >
            Ajouter une option
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {options.length === 0 ? (
            <p className="text-sm text-(--sage)">Aucune option pour ce produit.</p>
          ) : (
            options.map((option, index) => (
              <div
                key={option.id ?? `new-${index}`}
                className="grid gap-3 rounded border border-(--forest)/10 p-3 md:grid-cols-[1fr_1fr_10rem_auto]"
              >
                <input
                  value={option.name}
                  onChange={(e) => updateOption(index, "name", e.target.value)}
                  placeholder="Nom (ex. Taille)"
                  className="border border-(--forest)/15 px-3 py-2 text-sm"
                />
                <input
                  value={option.value}
                  onChange={(e) => updateOption(index, "value", e.target.value)}
                  placeholder="Valeur (ex. A4)"
                  className="border border-(--forest)/15 px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  value={option.priceAdjustment ?? 0}
                  onChange={(e) =>
                    updateOption(index, "priceAdjustment", Number(e.target.value))
                  }
                  placeholder="+/- MAD"
                  className="border border-(--forest)/15 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="flex items-center justify-center text-red-600 hover:bg-red-50"
                  title="Supprimer l'option"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
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

