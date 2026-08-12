"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { GithubIcon } from "./SocialIcons";
import TechLogo from "./TechLogo";
import ProyectoImagePlaceholder, {
  isGenericImage,
} from "./ProyectoImagePlaceholder";

export interface Proyecto {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  tecnologias: string[];
  linkDemo: string | null;
  linkGithub: string | null;
  destacado: boolean;
  screenshots: string[];
  videoUrl: string | null;
  funcionalidades: string[];
  desafios: string | null;
  aprendizajes: string | null;
}

// Cantidad de tecnologías visibles por card antes de colapsar el resto en
// "+N tecnologías". Mantiene la altura de las cards consistente en el grid
// sin importar cuántas tecnologías tenga cada proyecto.
const MAX_TAGS_VISIBLE = 5;

interface ProjectCardProps {
  proyecto: Proyecto;
  index: number;
  total: number;
  onDetalles: (proyecto: Proyecto) => void;
}

export default function ProjectCard({
  proyecto,
  index,
  total,
  onDetalles,
}: ProjectCardProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const visibleTags = proyecto.tecnologias.slice(0, MAX_TAGS_VISIBLE);
  const hiddenTags = proyecto.tecnologias.slice(MAX_TAGS_VISIBLE);
  const usePlaceholder = isGenericImage(proyecto.imagenUrl);
  const hasActions = !!proyecto.linkGithub || !!proyecto.linkDemo;
  const hiddenLabel = `+${hiddenTags.length} ${
    hiddenTags.length === 1 ? "tecnología" : "tecnologías"
  }`;

  // Si el título incluye un descriptor (ej. "LumenStore — Sistema de Gestión
  // Comercial"), se muestra el nombre como título y el descriptor como
  // subtítulo. Así las tarjetas mantienen títulos de longitud equilibrada.
  const [tituloPrincipal, ...subtituloParts] = proyecto.titulo.split("—");
  const subtitulo = subtituloParts.length > 0
    ? subtituloParts.join("—").trim()
    : null;

  return (
    <article className="card project-card group flex flex-col h-full overflow-hidden">
      <button
        type="button"
        onClick={() => onDetalles(proyecto)}
        title={`Ver detalles de ${proyecto.titulo}`}
        aria-haspopup="dialog"
        aria-label={`Ver detalles de ${proyecto.titulo}`}
        className="block w-full p-0 border-0 bg-transparent text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <div className="relative aspect-video overflow-hidden">
          {usePlaceholder ? (
            <ProyectoImagePlaceholder
              titulo={proyecto.titulo}
              tecnologiaPrincipal={proyecto.tecnologias[0]}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <img
              src={proyecto.imagenUrl!}
              alt={`Captura del proyecto ${proyecto.titulo}`}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {proyecto.destacado && (
            <div className="absolute left-4 top-4">
              <span className="project-badge">Destacado</span>
            </div>
          )}

          <span
            className="absolute right-4 top-4 font-mono text-[11px] font-medium tracking-widest text-white/60 pointer-events-none select-none [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </button>

      <div className="p-6 flex flex-col flex-1 gap-5">
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="project-card-title line-clamp-2">
              {tituloPrincipal.trim()}
            </h3>
            {subtitulo && (
              <p className="mt-1 text-xs font-medium text-[var(--text-2)] line-clamp-1">
                {subtitulo}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {visibleTags.map((tech) => (
              <TechLogo key={tech} tech={tech} />
            ))}
            {hiddenTags.length > 0 && (
              <button
                type="button"
                className="tech-pill tech-pill-toggle"
                onClick={() => setShowAllTags((v) => !v)}
                aria-expanded={showAllTags}
                aria-label={
                  showAllTags
                    ? "Ocultar tecnologías adicionales"
                    : `Mostrar ${hiddenTags.length} tecnologías adicionales`
                }
              >
                {showAllTags ? "Ocultar" : hiddenLabel}
                {showAllTags ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
            {showAllTags &&
              hiddenTags.map((tech) => (
                <TechLogo key={tech} tech={tech} />
              ))}
          </div>
        </div>

        <p className="text-[15px] text-[var(--text-2)] leading-7 line-clamp-3">
          {proyecto.descripcion}
        </p>

        <div className="mt-auto pt-5 border-t border-[var(--border)] flex flex-col gap-2">
          {hasActions && (
            <div className="flex flex-wrap gap-2">
              {proyecto.linkGithub && (
                <a
                  href={proyecto.linkGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn-card btn-card-ghost ${
                    proyecto.linkDemo ? "" : "flex-1"
                  }`}
                  aria-label={`Ver código en GitHub de ${proyecto.titulo}`}
                >
                  <GithubIcon className="w-4 h-4" />
                  GitHub
                </a>
              )}
              {proyecto.linkDemo && (
                <a
                  href={proyecto.linkDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn-card btn-card-primary ${
                    proyecto.linkGithub ? "" : "flex-1"
                  }`}
                  aria-label={`Visitar el sitio de ${proyecto.titulo}`}
                >
                  <ExternalLink className="w-4 h-4" />
                  Visitar proyecto
                </a>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => onDetalles(proyecto)}
            className="card-details-link w-full"
            aria-haspopup="dialog"
            aria-label={`Ver caso técnico de ${proyecto.titulo}`}
          >
            Ver caso técnico
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
