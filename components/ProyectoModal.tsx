"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  FileText,
  Sparkles,
  Zap,
  Trophy,
} from "lucide-react";
import { GithubIcon } from "./SocialIcons";

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

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=675&fit=crop";

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
   Media Carousel
   ─────────────────────────────────────────────────────────── */

function MediaCarousel({
  slides,
  hasVideo,
  titulo,
}: {
  slides: string[];
  hasVideo: boolean;
  titulo: string;
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isVideoActive = hasVideo && slideIndex === 0;
  const currentMedia = slides[slideIndex] || slides[0];
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

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    if (slides.length > 1) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [prev, next, slides.length]);

  return (
    <div className="relative w-full bg-black shrink-0 overflow-hidden rounded-t-xl">
      <div className="relative w-full aspect-video">
        <AnimatePresence mode="wait">
          {isVideoActive ? (
            <motion.div key="video" {...slideFade} className="absolute inset-0">
              <video
                ref={videoRef}
                src={currentMedia}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            <motion.div
              key={`img-${slideIndex}`}
              {...slideFade}
              className="absolute inset-0"
            >
              <img
                src={currentMedia}
                alt={`${titulo} — captura ${slideIndex}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

        {isVideoActive && (
          <button
            onClick={togglePlay}
            className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 backdrop-blur-sm transition-all text-xs"
            aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" fill="white" />
            ) : (
              <Play className="w-3.5 h-3.5" fill="white" />
            )}
            <span className="font-medium">{isPlaying ? "Pausa" : "Play"}</span>
          </button>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <AnimatePresence>
            {(hasPrev && !isMobile) || (hasPrev && isMobile) ? (
              <motion.button
                key="prev-arrow"
                {...fadeIn}
                onClick={prev}
                className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 backdrop-blur-sm transition-all
                  ${isMobile ? "flex" : "hidden md:flex"}`}
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {(hasNext && !isMobile) || (hasNext && isMobile) ? (
              <motion.button
                key="next-arrow"
                {...fadeIn}
                onClick={next}
                className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 backdrop-blur-sm transition-all
                  ${isMobile ? "flex" : "hidden md:flex"}`}
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : null}
          </AnimatePresence>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-200 rounded-full ${
                  i === slideIndex
                    ? "bg-[var(--accent)] w-6 h-2"
                    : "bg-white/40 hover:bg-white/60 w-2 h-2"
                }`}
                aria-label={`Ir a slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   Section Components
   ─────────────────────────────────────────────────────────── */

function SectionDivider() {
  return <div className="divider my-6" />;
}

function SectionTitle({
  icon,
  label,
  color = "var(--accent)",
}: {
  icon: React.ReactNode;
  label: string;
  color?: string;
}) {
  return (
    <h3
      className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest mb-4"
      style={{ color }}
    >
      {icon}
      {label}
    </h3>
  );
}

/* ───────────────────────────────────────────────────────────
   Main Modal Component
   ─────────────────────────────────────────────────────────── */

export default function ProyectoModal({
  proyecto,
  onClose,
}: ProyectoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const isOpen = proyecto !== null;

  useFocusTrap(modalRef, isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const slides = proyecto
    ? [
        ...(proyecto.videoUrl ? [proyecto.videoUrl] : []),
        proyecto.imagenUrl || FALLBACK_IMG,
        ...(proyecto.screenshots?.length ? proyecto.screenshots : []),
      ]
    : [];

  const hasVideo = !!proyecto?.videoUrl;

  return (
    <AnimatePresence>
      {isOpen && proyecto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            {...fadeIn}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal wrapper — centers the dialog */}
          <div className="relative flex items-center justify-center w-full h-full p-3 sm:p-6 pointer-events-none">
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label={proyecto.titulo}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="pointer-events-auto bg-[var(--bg)] border border-[var(--border)] rounded-xl w-full max-w-4xl overflow-y-auto"
              style={{ maxHeight: "min(90vh, 90dvh, 850px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media Carousel */}
              <div className="group/media relative">
                <MediaCarousel
                  slides={slides}
                  hasVideo={hasVideo}
                  titulo={proyecto.titulo}
                />
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="sticky top-4 float-right mr-4 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 backdrop-blur-sm transition-all -mt-7"
                aria-label="Cerrar"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="px-6 sm:px-8 pt-6 sm:pt-7 pb-6 sm:pb-8">
                {/* HEADER: Title + Tech + Buttons */}
                <div className="pb-5 border-b border-[var(--border)]">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="heading-lg mb-3">{proyecto.titulo}</h2>
                      <div className="flex flex-wrap gap-1.5">
                        {proyecto.tecnologias.map((tech) => (
                          <span key={tech} className="chip text-[11px]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 shrink-0">
                      {proyecto.linkGithub && (
                        <a
                          href={proyecto.linkGithub}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary text-sm"
                        >
                          <GithubIcon className="w-4 h-4" />
                          Código
                        </a>
                      )}
                      {proyecto.linkDemo && (
                        <a
                          href={proyecto.linkDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Ver Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* SOBRE EL PROYECTO */}
                <div className="mt-6">
                  <SectionTitle
                    icon={<FileText className="w-4 h-4" />}
                    label="Sobre el proyecto"
                  />
                  <p
                    className="text-[15px] leading-relaxed text-[var(--text)]"
                    style={{ opacity: 0.8 }}
                  >
                    {proyecto.descripcion}
                  </p>
                </div>

                {/* CARACTERÍSTICAS CLAVE */}
                {proyecto.funcionalidades?.length > 0 && (
                  <>
                    <SectionDivider />
                    <div>
                      <SectionTitle
                        icon={<Sparkles className="w-4 h-4" />}
                        label="Características clave"
                      />
                      <ul className="space-y-2.5">
                        {proyecto.funcionalidades.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm leading-relaxed"
                            style={{ color: "var(--text)", opacity: 0.75 }}
                          >
                            <span
                              className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: "var(--accent)" }}
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* DESAFÍO TÉCNICO */}
                {proyecto.desafios && (
                  <>
                    <SectionDivider />
                    <div>
                      <SectionTitle
                        icon={<Zap className="w-4 h-4" />}
                        label="Desafío técnico"
                        color="#f59e0b"
                      />
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text)", opacity: 0.75 }}
                      >
                        {proyecto.desafios}
                      </p>
                    </div>
                  </>
                )}

                {/* RESULTADOS */}
                {proyecto.aprendizajes && (
                  <>
                    <SectionDivider />
                    <div>
                      <SectionTitle
                        icon={<Trophy className="w-4 h-4" />}
                        label="Resultados"
                        color="#06b6d4"
                      />
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text)", opacity: 0.75 }}
                      >
                        {proyecto.aprendizajes}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
