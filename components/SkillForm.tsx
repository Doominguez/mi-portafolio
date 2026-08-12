"use client";

import { FormEvent, useState } from "react";

interface SkillFormProps {
  initialData?: {
    id?: string;
    nombre: string;
    categoria: string;
    logoUrl: string;
    orden: number;
  };
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

const labelClass = "mb-1.5 block text-sm font-medium text-[var(--text)]";
const hintClass = "mt-1.5 text-xs leading-relaxed text-[var(--text-2)]";

const CATEGORIES = [
  { value: "Backend", label: "Backend" },
  { value: "Frontend", label: "Frontend" },
  { value: "Base de datos", label: "Base de datos" },
  { value: "Herramientas", label: "Herramientas" },
];

export default function SkillForm({
  initialData,
  onSubmit,
  submitLabel,
}: SkillFormProps) {
  const [nombre, setNombre] = useState(initialData?.nombre || "");
  const [categoria, setCategoria] = useState(
    initialData?.categoria || "Frontend",
  );
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const [orden, setOrden] = useState(String(initialData?.orden ?? 0));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleUpload(e: FormEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data?.url) {
      setLogoUrl(data.url);
    }
    setUploading(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    form.set("logoUrl", logoUrl);

    await onSubmit(form);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {initialData?.id && (
        <input type="hidden" name="skillId" value={initialData.id} />
      )}
      <div>
        <label className={labelClass}>Nombre</label>
        <input
          name="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          placeholder="Ej. React"
          className="input-field"
        />
      </div>

      <div>
        <label className={labelClass}>Categoría</label>
        <select
          name="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="input-field"
        >
          {CATEGORIES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="w-full text-sm text-[var(--text-2)] file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-[var(--surface)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--text)] hover:file:bg-[var(--border)]"
        />
        {uploading && (
          <p className="mt-1.5 text-sm text-[var(--text-2)]">
            Subiendo logo...
          </p>
        )}
      </div>

      <div>
        <label className={labelClass}>URL del logo</label>
        <input
          name="logoUrl"
          type="url"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          required
          placeholder="https://..."
          className="input-field"
        />
        <p className={hintClass}>
          Si subís un archivo, la URL se cargará automáticamente.
        </p>
      </div>

      {logoUrl && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="text-sm font-semibold text-[var(--text)]">
            Vista previa del logo
          </div>
          <div className="mt-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-white p-4 shadow-sm">
            <img
              src={logoUrl}
              alt="Logo preview"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}

      <div>
        <label className={labelClass}>Orden (menor primero)</label>
        <input
          name="orden"
          type="number"
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          min={0}
          className="input-field"
        />
        <p className={hintClass}>
          Controla el orden de los logos dentro de cada categoría.
        </p>
      </div>

      <button
        type="submit"
        disabled={saving || uploading}
        className="btn-primary w-full"
      >
        {saving ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
