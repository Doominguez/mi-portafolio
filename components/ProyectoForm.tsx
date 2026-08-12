"use client";

import { FormEvent, useState, useRef } from "react";
import type { Skill } from "@/lib/skills";

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
  availableSkills?: Skill[];
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel: string;
  proyectoId?: string;
}

const labelClass = "mb-1.5 block text-sm font-medium text-[var(--text)]";
const hintClass = "mt-1.5 text-xs leading-relaxed text-[var(--text-2)]";

export default function ProyectoForm({
  initialData,
  availableSkills,
  onSubmit,
  submitLabel,
  proyectoId,
}: ProyectoFormProps) {
  const [imagenUrl, setImagenUrl] = useState(initialData?.imagenUrl || "");
  const [screenshots, setScreenshots] = useState<string[]>(
    initialData?.screenshots
      ? initialData.screenshots
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean)
      : [],
  );
  const [manualScreenshots, setManualScreenshots] = useState(
    initialData?.screenshots || "",
  );

  const availableSkillNames = new Set(
    (availableSkills || []).map((skill) => skill.nombre.toLowerCase()),
  );
  const initialTecnologias = (initialData?.tecnologias || "")
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);
  const initialSelectedSkills = initialTecnologias.filter((tech) =>
    availableSkillNames.has(tech.toLowerCase()),
  );
  const initialManualTecnologias = initialTecnologias
    .filter((tech) => !availableSkillNames.has(tech.toLowerCase()))
    .join(", ");

  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    initialSelectedSkills,
  );
  const [manualTecnologias, setManualTecnologias] = useState(
    initialManualTecnologias,
  );
  const [uploading, setUploading] = useState(false);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function parseScreenshotUrls(raw: string) {
    return raw
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);
  }

  function removeScreenshot(url: string) {
    setScreenshots((prev) => prev.filter((item) => item !== url));
    setManualScreenshots((prev) =>
      parseScreenshotUrls(prev)
        .filter((item) => item !== url)
        .join(", "),
    );
  }

  function removeImagenUrl() {
    setImagenUrl("");
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  const mergedScreenshots = Array.from(
    new Set([...screenshots, ...parseScreenshotUrls(manualScreenshots)]),
  );

  const previewScreenshots = mergedScreenshots;

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

  async function handleScreenshotUpload(e: FormEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (!files?.length) return;

    setUploadingScreenshots(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data?.url) {
        uploadedUrls.push(data.url);
      }
    }

    setScreenshots((prev) => [...prev, ...uploadedUrls]);
    setUploadingScreenshots(false);
  }

  function getSelectedTecnologias() {
    const manual = manualTecnologias
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);
    const unique = Array.from(
      new Set([...selectedSkills, ...manual].map((tech) => tech.trim())),
    ).filter(Boolean);
    return unique;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    form.set("imagenUrl", imagenUrl);
    form.set("screenshots", mergedScreenshots.join(", "));
    form.set("tecnologias", getSelectedTecnologias().join(", "));

    await onSubmit(form);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {proyectoId && (
        <input type="hidden" name="proyectoId" value={proyectoId} />
      )}

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
          Usá una etiqueta por línea ({"Resumen:"}, {"El problema:"},{" "}
          {"La solución:"}, {"Impacto:"}) para que el modal las muestre como
          viñetas. Sin etiquetas, se mostrará como párrafo.
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
        {imagenUrl ? (
          <div className="mt-3 relative overflow-hidden rounded-lg border border-[var(--border)]">
            <img
              src={imagenUrl}
              alt="Vista previa de la imagen principal"
              className="h-40 w-full object-cover"
            />
            <button
              type="button"
              onClick={removeImagenUrl}
              className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--text)] shadow-sm transition hover:bg-white"
            >
              Eliminar
            </button>
          </div>
        ) : null}
        <input type="hidden" name="imagenUrl" value={imagenUrl} />
        <p className={hintClass}>
          Si no subís imagen, se genera automáticamente una vista previa del
          proyecto.
        </p>
      </div>

      <div>
        <label className={labelClass}>Screenshots</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleScreenshotUpload}
          className="w-full text-sm text-[var(--text-2)] file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-[var(--surface)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--text)] hover:file:bg-[var(--border)]"
        />
        {uploadingScreenshots && (
          <p className="mt-1.5 text-sm text-[var(--text-2)]">
            Subiendo capturas...
          </p>
        )}
        {previewScreenshots.length > 0 && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {previewScreenshots.map((url, index) => (
              <div
                key={url + index}
                className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <button
                  type="button"
                  onClick={() => removeScreenshot(url)}
                  className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--text)] shadow-sm transition hover:bg-white"
                >
                  Eliminar
                </button>
                <div className="aspect-video w-full overflow-hidden bg-black/5">
                  <img
                    src={url}
                    alt={`Captura ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <input
          type="hidden"
          name="screenshots"
          value={mergedScreenshots.join(", ")}
        />
        <p className={hintClass}>
          Subí una o varias capturas desde tu PC. Si preferís usar URLs, podés
          pegarlas abajo.
        </p>
      </div>

      <div>
        <label className={labelClass}>
          Screenshots adicionales (URLs separadas por coma)
        </label>
        <input
          value={manualScreenshots}
          onChange={(e) => setManualScreenshots(e.target.value)}
          placeholder="https://...jpg, https://...png"
          className="input-field"
        />
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
        <label className={labelClass}>Stack desde habilidades existentes</label>
        <p className={hintClass}>
          Seleccioná las tecnologías ya cargadas en Habilidades técnicas para
          evitar escribir nombres y que el stack use los logos existentes.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(availableSkills || []).map((skill) => {
            const selected = selectedSkills.includes(skill.nombre);
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => {
                  setSelectedSkills((current) =>
                    current.includes(skill.nombre)
                      ? current.filter((item) => item !== skill.nombre)
                      : [...current, skill.nombre],
                  );
                }}
                aria-pressed={selected}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm transition-all duration-200 ${
                  selected
                    ? "border-[var(--accent)] bg-[var(--surface)] shadow-sm"
                    : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--text)]"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-[var(--bg-2)] p-2">
                  <img
                    src={skill.logoUrl}
                    alt={skill.nombre}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="font-semibold text-[var(--text)]">
                  {skill.nombre}
                </span>
              </button>
            );
          })}
          {(availableSkills || []).length === 0 && (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm text-[var(--text-2)]">
              No hay skills disponibles aún. Agregá logos en el panel de
              habilidades para usarlos aquí.
            </div>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Otras tecnologías (separadas por coma)
        </label>
        <input
          value={manualTecnologias}
          onChange={(e) => setManualTecnologias(e.target.value)}
          placeholder="Docker, Redis, GraphQL"
          className="input-field"
        />
        <p className={hintClass}>
          Si necesitás una tecnología que no está en Habilidades técnicas, podés
          escribirla acá.
        </p>
      </div>

      <input
        type="hidden"
        name="tecnologias"
        value={getSelectedTecnologias().join(", ")}
      />

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
        <label className={labelClass}>
          URL del video demo (opcional, 16:9)
        </label>
        <input
          name="videoUrl"
          defaultValue={initialData?.videoUrl}
          placeholder="https://...mp4"
          className="input-field"
        />
      </div>

      <div>
        <label className={labelClass}>
          Funcionalidades clave (una por línea)
        </label>
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
