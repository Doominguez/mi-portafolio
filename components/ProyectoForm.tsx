"use client";

import { FormEvent, useState, useRef } from "react";

interface ProyectoFormProps {
  initialData?: {
    titulo: string;
    descripcion: string;
    imagenUrl: string;
    linkDemo: string;
    linkGithub: string;
    tecnologias: string;
    destacado: boolean;
    screenshots: string;
    videoUrl: string;
    funcionalidades: string;
    desafios: string;
    aprendizajes: string;
  };
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel: string;
  proyectoId?: string;
}

export default function ProyectoForm({
  initialData,
  onSubmit,
  submitLabel,
  proyectoId,
}: ProyectoFormProps) {
  const [imagenUrl, setImagenUrl] = useState(initialData?.imagenUrl || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: FormEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setImagenUrl(data.url);
    setUploading(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    form.set("imagenUrl", imagenUrl);

    await onSubmit(form);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {proyectoId && <input type="hidden" name="proyectoId" value={proyectoId} />}
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Titulo
        </label>
        <input
          name="titulo"
          defaultValue={initialData?.titulo}
          required
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Descripcion
        </label>
        <textarea
          name="descripcion"
          defaultValue={initialData?.descripcion}
          required
          rows={4}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Imagen
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="w-full text-sm text-neutral-500 file:mr-4 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-neutral-700 hover:file:bg-neutral-200 dark:file:bg-neutral-800 dark:file:text-neutral-300"
        />
        {uploading && (
          <p className="mt-1 text-sm text-neutral-500">Subiendo imagen...</p>
        )}
        {imagenUrl && (
          <img
            src={imagenUrl}
            alt="Preview"
            className="mt-3 h-40 rounded-lg object-cover"
          />
        )}
        <input type="hidden" name="imagenUrl" value={imagenUrl} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Link Demo
          </label>
          <input
            name="linkDemo"
            defaultValue={initialData?.linkDemo}
            placeholder="https://..."
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Link GitHub
          </label>
          <input
            name="linkGithub"
            defaultValue={initialData?.linkGithub}
            placeholder="https://github.com/..."
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Tecnologias (separadas por coma)
        </label>
        <input
          name="tecnologias"
          defaultValue={initialData?.tecnologias}
          required
          placeholder="React, Next.js, TypeScript"
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          name="destacado"
          defaultChecked={initialData?.destacado}
          className="h-4 w-4 rounded border-neutral-300"
        />
        Proyecto destacado
      </label>

      <div className="divider my-6" />

      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">
        Contenido del dialog
      </h3>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          URL Video demo (opcional, 16:9)
        </label>
        <input
          name="videoUrl"
          defaultValue={initialData?.videoUrl}
          placeholder="https://...mp4"
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Screenshots (URLs separadas por coma)
        </label>
        <input
          name="screenshots"
          defaultValue={initialData?.screenshots}
          placeholder="https://...jpg, https://...png"
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Funcionalidades clave (una por linea)
        </label>
        <textarea
          name="funcionalidades"
          defaultValue={initialData?.funcionalidades}
          rows={4}
          placeholder="Autenticacion JWT&#10;Dashboard en tiempo real&#10;Exportacion a PDF"
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Desafios tecnicos (opcional)
        </label>
        <textarea
          name="desafios"
          defaultValue={initialData?.desafios}
          rows={3}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Aprendizajes (opcional)
        </label>
        <textarea
          name="aprendizajes"
          defaultValue={initialData?.aprendizajes}
          rows={3}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        {saving ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
