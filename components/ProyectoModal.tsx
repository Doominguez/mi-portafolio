"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
} from "lucide-react";
import { GithubIcon } from "./SocialIcons";
import TechLogo from "./TechLogo";
import type { Skill } from "@/lib/skills";
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
  skills?: Skill[];
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
   Media Carousel (solo imágenes) + Lightbox
   ─────────────────────────────────────────────────────────── */

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), textarea, input, select';

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loadedIndexes, setLoadedIndexes] = useState<Set<number>>(new Set());
  const openerRef = useRef<HTMLButtonElement>(null);

  const current = slides[slideIndex] || slides[0];
  const hasPrev = slideIndex > 0;
  const hasNext = slideIndex < slides.length - 1;
  const isPlaceholder = current === PLACEHOLDER_SLIDE;

  const goTo = useCallback((i: number) => {
    setSlideIndex(i);
  }, []);

  const prev = useCallback(() => {
    setSlideIndex((i) => Math.max(0, i - 1));
  }, []);

  const next = useCallback(() => {
    setSlideIndex((i) => Math.min(slides.length - 1, i + 1));
  }, [slides.length]);

  const markLoaded = useCallback((i: number) => {
    setLoadedIndexes((currentSet) => {
      if (currentSet.has(i)) return currentSet;
      const nextSet = new Set(currentSet);
      nextSet.add(i);
      return nextSet;
    });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [prev, next, slides.length]);

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => {
    setLightboxOpen(false);
    requestAnimationFrame(() => openerRef.current?.focus());
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-transparent">
      <AnimatePresence mode="wait">
        {isPlaceholder ? (
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
          <motion.button
            type="button"
            ref={openerRef}
            key={`img-${slideIndex}`}
            {...slideFade}
            onClick={openLightbox}
            aria-haspopup="dialog"
            aria-label={`Ampliar captura ${slideIndex + 1} de ${slides.length} de ${titulo}`}
            className="carousel-image absolute inset-0 block h-full w-full cursor-zoom-in p-0 text-left"
          >
            {!loadedIndexes.has(slideIndex) && (
              <span className="carousel-loader" aria-hidden="true">
                <span className="spinner" />
              </span>
            )}
            <img
              src={current}
              alt={`${titulo} — captura ${slideIndex + 1}`}
              className="h-full w-full object-cover"
              draggable={false}
              onLoad={() => markLoaded(slideIndex)}
              onError={() => markLoaded(slideIndex)}
            />
            <span className="zoom-hint" aria-hidden="true">
              <Maximize2 className="h-4 w-4" />
            </span>
          </motion.button>
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
                className={`h-2 rounded-full transition-all duration-200 ${i === slideIndex
                    ? "w-6 bg-[var(--accent)]"
                    : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
              />
            ))}
          </div>
        </>
      )}

      {lightboxOpen && !isPlaceholder && (
        <Lightbox
          slides={slides}
          startIndex={slideIndex}
          titulo={titulo}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}

function Lightbox({
  slides,
  startIndex,
  titulo,
  onClose,
}: {
  slides: string[];
  startIndex: number;
  titulo: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const boxRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const current = slides[index] ?? slides[0];

  const clampIndex = useCallback(
    (i: number) => (i + slides.length) % slides.length,
    [slides.length],
  );

  const prev = useCallback(() => {
    setIndex((i) => clampIndex(i - 1));
  }, [clampIndex]);

  const next = useCallback(() => {
    setIndex((i) => clampIndex(i + 1));
  }, [clampIndex]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      // El lightbox intercepta Escape, flechas y Tab (fase de captura) para
      // no propagar el cierre del modal ni la navegación del carrusel.
      if (
        e.key !== "Escape" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight" &&
        e.key !== "Tab"
      ) {
        return;
      }
      e.stopPropagation();

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
        return;
      }
      if (e.key === "Tab" && boxRef.current) {
        const focusable = Array.from(
          boxRef.current.querySelectorAll<HTMLElement>(focusableSelector),
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey, true);
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => document.removeEventListener("keydown", handleKey, true);
  }, [onClose, prev, next]);

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <motion.div {...fadeIn} className="lightbox-backdrop" onClick={onClose} />

      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Vista ampliada de ${titulo}`}
        className="lightbox-dialog"
      >
        <div className="lightbox-header">
          <span className="lightbox-counter">
            {index + 1} / {slides.length}
          </span>
          <button
            type="button"
            ref={closeRef}
            onClick={onClose}
            aria-label="Cerrar vista ampliada"
            className="lightbox-close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className="lightbox-stage"
          onClick={onClose}
          aria-label={`Ampliada ${index + 1} de ${slides.length}`}
        >
          <img
            src={current}
            alt={`${titulo} — captura ${index + 1}`}
            className="lightbox-img"
            draggable={false}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Imagen anterior"
              className="lightbox-nav prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Imagen siguiente"
              className="lightbox-nav next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
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

/* ───────────────────────────────────────────────────────────
   Dialog (se remonta con key={proyecto.id}, así su estado de
   medios se reinicia al cambiar de proyecto o al abrirse)
   ─────────────────────────────────────────────────────────── */

function ProyectoModalDialog({
  proyecto,
  onClose,
  skills,
}: {
  proyecto: Proyecto;
  onClose: () => void;
  skills?: Skill[];
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  const skillLogoByNombre = new Map<string, string | undefined>();
  for (const skill of skills ?? []) {
    skillLogoByNombre.set(skill.nombre.toLowerCase(), skill.logoUrl);
  }

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

  const descripcionExtras = getDescripcionExtras(proyecto.descripcion);

  const problemText =
    descripcionExtras?.find((item) => /problema/i.test(item.label))?.text ||
    proyecto.desafios;
  const solutionText =
    descripcionExtras?.find((item) => /soluci[oó]n/i.test(item.label))?.text ||
    proyecto.aprendizajes;

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        {...fadeIn}
        transition={{ duration: 0.15 }}
        className="modal-overlay"
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="modal"
          style={{ maxHeight: "min(90vh, 90dvh, 860px)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div>
              <div className="eyebrow">Proyecto</div>
              <h1 id="modal-title">{proyecto.titulo}</h1>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="close-btn"
            >
              <X />
            </button>
          </div>

          <div className="modal-body">
            <div className="hero">
              <div className="hero-shot">
                <MediaCarousel
                  slides={slides}
                  titulo={proyecto.titulo}
                  tecnologiaPrincipal={proyecto.tecnologias[0]}
                />
              </div>

              <div className="summary-card">
                <div className="summary-row">
                  <div className="k">Tecnologías utilizadas</div>
                  <div className="stack-tags">
                    {proyecto.tecnologias.map((tech) => (
                      <TechLogo
                        key={tech}
                        tech={tech}
                        size="sm"
                        logoUrl={skillLogoByNombre.get(tech.toLowerCase())}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <section className="about">
              <div className="section-label">Sobre el proyecto</div>
              <p>{proyecto.descripcion}</p>
            </section>

            {(problemText || solutionText) && (
              <section>
                <div className="section-label">Problema y solución</div>
                <div className="prob-sol">
                  {problemText ? (
                    <div className="ps-card problem">
                      <div className="tag">Problema</div>
                      <p>{problemText}</p>
                    </div>
                  ) : null}
                  {solutionText ? (
                    <div className="ps-card solution">
                      <div className="tag">Solución</div>
                      <p>{solutionText}</p>
                    </div>
                  ) : null}
                </div>
              </section>
            )}

            {hasVideo && (
              <section>
                <div className="section-label">Demostración</div>
                <div className="demo-frame">
                  {showVideo && hasVideo && videoMounted ? (
                    <>
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
                          src={videoUrl ?? undefined}
                          className="h-full w-full"
                        />
                      )}
                      <button
                        type="button"
                        onClick={showCapturas}
                        aria-label="Cerrar video"
                        className="video-close-btn"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="relative flex h-full w-full items-center justify-center">
                      {hasVideo && (
                        <button
                          type="button"
                          onClick={showDemo}
                          className="play-btn"
                          aria-label="Reproducir demo"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {proyecto.funcionalidades.length > 0 && (
              <section>
                <div className="section-label">Funcionalidades</div>
                <div className="features-grid">
                  {proyecto.funcionalidades.map((funcionalidad) => (
                    <div key={funcionalidad} className="feature-pill">
                      <span className="dot">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                      {funcionalidad}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="modal-footer">
            {proyecto.linkGithub && (
              <a
                href={proyecto.linkGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
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
                className="btn btn-primary"
              >
                <ExternalLink className="h-4 w-4" />
                Ver demo
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   Main Modal Component
   ─────────────────────────────────────────────────────────── */

export default function ProyectoModal({
  proyecto,
  onClose,
  skills,
}: ProyectoModalProps) {
  const isOpen = proyecto !== null;

  return (
    <AnimatePresence>
      {isOpen && proyecto && (
        <ProyectoModalDialog
          key={proyecto.id}
          proyecto={proyecto}
          onClose={onClose}
          skills={skills}
        />
      )}
    </AnimatePresence>
  );
}
