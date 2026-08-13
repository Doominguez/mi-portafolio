"use client";

import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "./SocialIcons";
import TechStackRow from "./TechStackRow";
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

import type { Skill } from "@/lib/skills";

interface ProjectCardProps {
  proyecto: Proyecto;
  index: number;
  total: number;
  onDetalles: (proyecto: Proyecto) => void;
  skills?: Skill[];
}

export default function ProjectCard({
  proyecto,
  index,
  total,
  onDetalles,
  skills,
}: ProjectCardProps) {
  const usePlaceholder = isGenericImage(proyecto.imagenUrl);
  const hasActions = !!proyecto.linkGithub || !!proyecto.linkDemo;

  const [tituloPrincipal, ...subtituloParts] = proyecto.titulo.split("—");
  const subtitulo = subtituloParts.length > 0
    ? subtituloParts.join("—").trim()
    : null;

  return (
    <article className="group flex flex-col h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-xl hover:-translate-y-1">
      {/* Clickable Image Preview */}
      <button
        type="button"
        onClick={() => onDetalles(proyecto)}
        title={`Ver caso técnico de ${proyecto.titulo}`}
        aria-haspopup="dialog"
        aria-label={`Ver detalles de ${proyecto.titulo}`}
        className="block w-full p-0 border-0 bg-transparent text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-2)] border-b border-[var(--border)]">
          {usePlaceholder ? (
            <ProyectoImagePlaceholder
              titulo={proyecto.titulo}
              tecnologiaPrincipal={proyecto.tecnologias[0]}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <img
              src={proyecto.imagenUrl!}
              alt={`Captura del proyecto ${proyecto.titulo}`}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Minimalist Top Badges */}
          <div className="absolute inset-x-4 top-4 flex items-center justify-between pointer-events-none">
            {proyecto.destacado ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-md shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Destacado
              </span>
            ) : (
              <div />
            )}

            <span
              className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium text-white/80 bg-black/40 border border-white/10 backdrop-blur-md select-none"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>
      </button>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--accent-text)] transition-colors duration-200 line-clamp-1">
            {tituloPrincipal.trim()}
          </h3>
          {subtitulo && (
            <p className="mt-1 text-xs text-[var(--text-2)] font-medium line-clamp-1">
              {subtitulo}
            </p>
          )}
        </div>

        {/* Tech Stack – single row with overflow button */}
        <TechStackRow techs={proyecto.tecnologias} skills={skills} />

        <p className="text-sm text-[var(--text-2)] leading-relaxed line-clamp-2 sm:line-clamp-3">
          {proyecto.descripcion}
        </p>

        {/* Actions Row */}
        <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
          {hasActions ? (
            <div className="flex items-center gap-2">
              {proyecto.linkGithub && (
                <a
                  href={proyecto.linkGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-2)] hover:text-[var(--text)] px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] transition-colors"
                  aria-label={`Ver código en GitHub de ${proyecto.titulo}`}
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
              {proyecto.linkDemo && (
                <a
                  href={proyecto.linkDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                  aria-label={`Visitar el sitio de ${proyecto.titulo}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Demo
                </a>
              )}
            </div>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => onDetalles(proyecto)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-text)] hover:text-[var(--accent-hover)] transition-colors cursor-pointer group/btn ml-auto"
            aria-haspopup="dialog"
            aria-label={`Ver caso técnico de ${proyecto.titulo}`}
          >
            <span>Caso técnico</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
