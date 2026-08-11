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

const labelClass = "mb-1.5 block text-sm font-medium text-[var(--text)]";
const hintClass = "mt-1.5 text-xs leading-relaxed text-[var(--text-2)]";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {proyectoId && <input type="hidden" name="proyectoId" value={proyectoId} />}

      <div>
        <label className={labelClass}>Título</label>
        <input
          name="titulo"
          defaultValue={initialData?.titulo}
          required
          placeholder="Ej. LumenStore — Sistema de Gestión Comercial"
          className="input-field"
        />
      </div>

      <div>
        <label className={labelClass}>Descripción</label>
        <textarea
          name="descripcion"
          defaultValue={initialData?.descripcion}
          required
          rows={5}
          placeholder={
            "Resumen: Qué hace el proyecto en 1-2 líneas.\nEl problema: Qué problema resuelve.\nLa solución: Cómo lo resuelve.\nImpacto: Resultados o métricas."
          }
          className="input-field"
        />
        <p className={hintClass}>
          Usá una etiqueta por línea ({"Resumen:"}, {"El problema:"}, {"La solución:"},{" "}
          {"Impacto:"}) para que el modal las muestre como viñetas. Sin etiquetas, se
          mostrará como párrafo.
        </p>
      </div>

      <div>
        <label className={labelClass}>Imagen principal</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="w-full text-sm text-[var(--text-2)] file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-[var(--surface)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--text)] hover:file:bg-[var(--border)]"
        />
        {uploading && (
          <p className="mt-1.5 text-sm text-[var(--text-2)]">
            Subiendo imagen...
          </p>
        )}
        {imagenUrl && (
          <img
            src={imagenUrl}
            alt="Vista previa de la imagen principal"
            className="mt-3 h-40 rounded-lg border border-[var(--border)] object-cover"
          />
        )}
        <input type="hidden" name="imagenUrl" value={imagenUrl} />
        <p className={hintClass}>
          Si no subís imagen, se genera automáticamente una vista previa del
          proyecto.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Link Demo</label>
          <input
            name="linkDemo"
            defaultValue={initialData?.linkDemo}
            placeholder="https://..."
            className="input-field"
          />
        </div>
        <div>
          <label className={labelClass}>Link GitHub</label>
          <input
            name="linkGithub"
            defaultValue={initialData?.linkGithub}
            placeholder="https://github.com/..."
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tecnologías (separadas por coma)</label>
        <input
          name="tecnologias"
          defaultValue={initialData?.tecnologias}
          required
          placeholder="Angular, TypeScript, Spring Boot, MySQL"
          className="input-field"
        />
        <p className={hintClass}>
          En el modal se agrupan automáticamente por categoría (Frontend,
          Backend, Base de datos, DevOps).
        </p>
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm font-medium text-[var(--text)]">
        <input
          type="checkbox"
          name="destacado"
          defaultChecked={initialData?.destacado}
          className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
        />
        Proyecto destacado
      </label>

      <div className="divider" />

      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-2)]">
        Contenido del modal
      </h3>

      <div>
        <label className={labelClass}>URL del video demo (opcional, 16:9)</label>
        <input
          name="videoUrl"
          defaultValue={initialData?.videoUrl}
          placeholder="https://...mp4"
          className="input-field"
        />
      </div>

      <div>
        <label className={labelClass}>
          Screenshots (URLs separadas por coma)
        </label>
        <input
          name="screenshots"
          defaultValue={initialData?.screenshots}
          placeholder="https://...jpg, https://...png"
          className="input-field"
        />
      </div>

      <div>
        <label className={labelClass}>Funcionalidades clave (una por línea)</label>
        <textarea
          name="funcionalidades"
          defaultValue={initialData?.funcionalidades}
          rows={4}
          placeholder="Autenticación JWT&#10;Dashboard en tiempo real&#10;Exportación a PDF"
          className="input-field"
        />
      </div>

      <div>
        <label className={labelClass}>Desafíos técnicos (opcional)</label>
        <textarea
          name="desafios"
          defaultValue={initialData?.desafios}
          rows={3}
          className="input-field"
        />
      </div>

      <div>
        <label className={labelClass}>Aprendizajes (opcional)</label>
        <textarea
          name="aprendizajes"
          defaultValue={initialData?.aprendizajes}
          rows={3}
          className="input-field"
        />
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
