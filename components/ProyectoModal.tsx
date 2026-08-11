"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "./SocialIcons";
import ProyectoImagePlaceholder, {
  isGenericImage,
} from "./ProyectoImagePlaceholder";

/* ───────────────────────────────────────────────────────────
   Types
   ─────────────────────────────────────────────────────────── */

interface Proyecto {
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

interface ProyectoModalProps {
  proyecto: Proyecto | null;
  onClose: () => void;
}

/* ───────────────────────────────────────────────────────────
   Constants
   ─────────────────────────────────────────────────────────── */

// Sentinel usado cuando el proyecto no tiene ninguna imagen real todavía
// (solo capturas de stock/placeholder). En ese caso mostramos el mismo
// placeholder generativo que la card, en vez de una foto de stock genérica.
const PLACEHOLDER_SLIDE = "__placeholder__";

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
} as const;

const slideFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: "easeInOut" as const },
} as const;

/* ───────────────────────────────────────────────────────────
   Focus Trap Hook
   ─────────────────────────────────────────────────────────── */

function useFocusTrap(
  containerRef: React.RefObject<HTMLDivElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), textarea, input, select';

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    requestAnimationFrame(() => {
      const focusable = getFocusable();
      if (focusable.length > 0) focusable[0].focus();
    });

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, containerRef]);
}

/* ───────────────────────────────────────────────────────────
   Media Carousel (solo imágenes)
   ─────────────────────────────────────────────────────────── */

function MediaCarousel({
  slides,
  titulo,
  tecnologiaPrincipal,
}: {
  slides: string[];
  titulo: string;
  tecnologiaPrincipal?: string;
}) {
  const [slideIndex, setSlideIndex] = useState(0);

  const current = slides[slideIndex] || slides[0];
  const hasPrev = slideIndex > 0;
  const hasNext = slideIndex < slides.length - 1;

  const goTo = useCallback((i: number) => {
    setSlideIndex(i);
  }, []);

  const prev = useCallback(() => {
    setSlideIndex((i) => Math.max(0, i - 1));
  }, []);

  const next = useCallback(() => {
    setSlideIndex((i) => Math.min(slides.length - 1, i + 1));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [prev, next, slides.length]);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {current === PLACEHOLDER_SLIDE ? (
          <motion.div
            key="placeholder"
            {...slideFade}
            className="absolute inset-0"
          >
            <ProyectoImagePlaceholder
              titulo={titulo}
              tecnologiaPrincipal={tecnologiaPrincipal}
              className="h-full w-full"
            />
          </motion.div>
        ) : (
          <motion.div
            key={`img-${slideIndex}`}
            {...slideFade}
            className="absolute inset-0"
          >
            <img
              src={current}
              alt={`${titulo} — captura ${slideIndex + 1}`}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            disabled={!hasPrev}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/90 backdrop-blur-md transition-colors hover:bg-black/70 disabled:opacity-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!hasNext}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/90 backdrop-blur-md transition-colors hover:bg-black/70 disabled:opacity-0"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir a la captura ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === slideIndex
                    ? "w-6 bg-[var(--accent)]"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   Helpers
   ─────────────────────────────────────────────────────────── */

// Convierte una descripción con líneas "Etiqueta: contenido" en secciones
// con viñeta. Si no tiene ese formato, se muestra como párrafo.
function parseDescripcion(
  descripcion: string,
): { label: string; text: string }[] | null {
  const items: { label: string; text: string }[] = [];
  for (const line of descripcion.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^([^:]{2,40}):\s*(.+)$/);
    if (match) items.push({ label: match[1].trim(), text: match[2].trim() });
  }
  return items.length >= 2 ? items : null;
}

// Primer bloque de la descripción ("Resumen: ...") como párrafo de entrada.
// Si la descripción no tiene ese formato, se usa completa.
function getDescripcionIntro(descripcion: string): string {
  const sections = parseDescripcion(descripcion);
  return sections && sections.length > 0 ? sections[0].text : descripcion;
}

// Bloques restantes de la descripción ("El problema:", "La solución:", ...)
// como respaldo de "Lo principal" cuando el proyecto no define funcionalidades.
function getDescripcionExtras(
  descripcion: string,
): { label: string; text: string }[] | null {
  const sections = parseDescripcion(descripcion);
  return sections && sections.length > 1 ? sections.slice(1) : null;
}

function isYouTubeUrl(url: string) {
  return /(?:youtu\.be\/|youtube\.com\/)/i.test(url);
}

function getYouTubeEmbedUrl(url: string) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?#\s]+)/i,
  );
  const videoId = match?.[1];
  return videoId
    ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    : url;
}

const listItemDot =
  "mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]";

/* ───────────────────────────────────────────────────────────
   Dialog (se remonta con key={proyecto.id}, así su estado de
   medios se reinicia al cambiar de proyecto o al abrirse)
   ─────────────────────────────────────────────────────────── */

function ProyectoModalDialog({
  proyecto,
  onClose,
}: {
  proyecto: Proyecto;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [mediaType, setMediaType] = useState<"img" | "video">("img");
  const [videoMounted, setVideoMounted] = useState(false);

  useFocusTrap(modalRef, true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const showVideo = mediaType === "video";

  const showCapturas = () => setMediaType("img");
  const showDemo = () => {
    setMediaType("video");
    setVideoMounted(true);
  };

  const slides = (() => {
    const media = [proyecto.imagenUrl, ...(proyecto.screenshots ?? [])].filter(
      (url): url is string => !!url && !isGenericImage(url),
    );
    return media.length > 0 ? media : [PLACEHOLDER_SLIDE];
  })();

  const hasVideo = !!proyecto.videoUrl;
  const videoUrl = proyecto.videoUrl;
  const isYouTube = videoUrl ? isYouTubeUrl(videoUrl) : false;
  const embeddedVideoUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  const descripcionIntro = getDescripcionIntro(proyecto.descripcion);
  const descripcionExtras = getDescripcionExtras(proyecto.descripcion);

  const highlightItems: ReactNode[] = [];
  if (proyecto.funcionalidades?.length) {
    for (const f of proyecto.funcionalidades) {
      highlightItems.push(f);
    }
  } else if (descripcionExtras) {
    for (const s of descripcionExtras) {
      highlightItems.push(
        <>
          <strong className="font-semibold text-[var(--text)]">
            {s.label}
          </strong>{" "}
          <span className="text-[var(--text-2)]">{s.text}</span>
        </>,
      );
    }
  }

  const hasLinks = !!proyecto.linkGithub || !!proyecto.linkDemo;

  const badges: ReactNode[] = [];
  if (proyecto.destacado) {
    badges.push(
      <span
        key="destacado"
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-2)] px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.06em] text-[var(--text-2)]"
      >
        Destacado
      </span>,
    );
  }
  if (proyecto.linkDemo) {
    badges.push(
      <span
        key="demo"
        className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,115,150,0.4)] bg-[rgba(0,115,150,0.1)] px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]"
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
          aria-hidden="true"
        />
        Demo activa
      </span>,
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        {...fadeIn}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="pointer-events-none relative flex h-full w-full items-center justify-center p-3 sm:p-6">
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)]"
          style={{ maxHeight: "min(90vh, 90dvh, 850px)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cerrar: siempre accesible, fijo sobre el modal */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-3 top-3 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/50 text-white/90 backdrop-blur-md transition-colors hover:bg-black/75 hover:text-white"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <X className="h-5 w-5" />
          </button>

          {/* ── Media + contenido scrollan juntos ── */}
          <div className="modal-scroll flex-1 overflow-y-auto overscroll-contain">
            {/* Media (capturas / video) */}
            <div className="relative shrink-0">
              {hasVideo && (
                <div className="absolute left-3 top-3 z-30 flex items-center gap-1 rounded-full border border-white/10 bg-black/50 p-1 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={showCapturas}
                    aria-pressed={!showVideo}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      !showVideo
                        ? "bg-[var(--accent)] text-white"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Capturas
                  </button>
                  <button
                    type="button"
                    onClick={showDemo}
                    aria-pressed={showVideo}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      showVideo
                        ? "bg-[var(--accent)] text-white"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Demo en video
                  </button>
                </div>
              )}

              <div className={showVideo ? "hidden" : "block"}>
                <MediaCarousel
                  slides={slides}
                  titulo={proyecto.titulo}
                  tecnologiaPrincipal={proyecto.tecnologias[0]}
                />
              </div>

              {videoMounted && hasVideo && videoUrl && (
                <div
                  className={`aspect-video w-full bg-black ${
                    showVideo ? "block" : "hidden"
                  }`}
                >
                  {isYouTube ? (
                    <iframe
                      src={embeddedVideoUrl || ""}
                      title={`Video de demostración de ${proyecto.titulo}`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      src={videoUrl}
                      className="h-full w-full"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Contenido */}
            <div className="px-6 py-7 sm:px-8 sm:py-8">
              {badges.length > 0 && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {badges}
                </div>
              )}

              <h2 id="modal-title" className="heading-lg">
                {proyecto.titulo}
              </h2>

              <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-2)]">
                {descripcionIntro}
              </p>

              {proyecto.tecnologias.length > 0 && (
                <section className="mt-7">
                  <h3 className="modal-section-label">Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {proyecto.tecnologias.map((tech) => (
                      <span key={tech} className="tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {highlightItems.length > 0 && (
                <section className="mt-7">
                  <h3 className="modal-section-label">Lo principal</h3>
                  <ul className="space-y-2.5">
                    {highlightItems.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[var(--text)]"
                      >
                        <span className={listItemDot} />
                        <p>{item}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {proyecto.desafios && (
                <section className="mt-7">
                  <h3 className="modal-section-label">Desafío técnico</h3>
                  <p className="text-[15px] leading-relaxed text-[var(--text-2)]">
                    {proyecto.desafios}
                  </p>
                </section>
              )}

              {proyecto.aprendizajes && (
                <section className="mt-7">
                  <h3 className="modal-section-label">Resultados</h3>
                  <p className="text-[15px] leading-relaxed text-[var(--text-2)]">
                    {proyecto.aprendizajes}
                  </p>
                </section>
              )}
            </div>
          </div>

          {/* ── Acciones (fijas, siempre visibles) ── */}
          {hasLinks && (
            <div className="flex shrink-0 gap-2.5 border-t border-[var(--border)] bg-[var(--bg)] p-4 sm:p-5">
              {proyecto.linkGithub && (
                <a
                  href={proyecto.linkGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex-1"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {proyecto.linkDemo && (
                <a
                  href={proyecto.linkDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visitar proyecto
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   Main Modal Component
   ─────────────────────────────────────────────────────────── */

export default function ProyectoModal({
  proyecto,
  onClose,
}: ProyectoModalProps) {
  const isOpen = proyecto !== null;

  return (
    <AnimatePresence>
      {isOpen && proyecto && (
        <ProyectoModalDialog
          key={proyecto.id}
          proyecto={proyecto}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}
