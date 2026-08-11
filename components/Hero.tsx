"use client";

import { motion } from "framer-motion";
import { Mail, Download, ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, JavaIcon } from "./SocialIcons";
import EmailLink from "./EmailLink";

export default function Hero() {
  const avatarContent = (
    <div className="relative">
      {/* Subtle blue glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          transform: "scale(1.3)",
          filter: "blur(20px)",
        }}
      />
      {/* Avatar */}
      <div
        className="relative w-[min(220px,60vw)] h-[min(220px,60vw)] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden"
        style={{
          border: "2px solid var(--border)",
          boxShadow: "0 0 0 6px var(--bg), 0 0 0 7px var(--border)",
        }}
      >
        <img
          src="/mifoto.png"
          alt="Junior Dominguez Montero"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );

  return (
    <section className="min-h-dvh flex items-center relative overflow-x-clip">
      {/* Subtle background gradient for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 40%, var(--surface) 0%, transparent 70%)",
        }}
      />

      <div className="container-portfolio py-24 md:py-0 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 items-center">
          {/* Text - 3 columns */}
          <div className="md:col-span-3">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
              style={{
                viewTransitionName: "hero-title",
                viewTransitionClass: "title-morph",
                fontSize: "clamp(2.2rem, 5.2vw, 4rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              Junior Dominguez
              <br />
              Montero
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl font-medium text-[var(--accent-text)] mb-8"
            >
              Desarrollador Backend{" "}
              <span className="inline-flex items-center gap-2">
                Java
                <JavaIcon className="h-6 w-auto" />
              </span>
            </motion.p>

            {/* Avatar en móvil: justo debajo del subtítulo, antes de los botones */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="md:hidden flex justify-center mb-10"
            >
              {avatarContent}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-body text-[var(--text-2)] mb-10 max-w-xl leading-relaxed"
            >
              Desarrollo aplicaciones web y APIs REST con Java y Spring Boot,
              aplicando arquitectura de software, seguridad y buenas prácticas
              para construir soluciones escalables.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col gap-5"
            >
              {/* Primary + Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/CV_Junior_Dominguez_1.pdf"
                  download
                  className="btn-primary"
                >
                  <Download className="w-4 h-4" />
                  Descargar CV
                </a>
                <a
                  href="#proyectos"
                  className="btn-secondary"
                  style={{
                    borderColor: "var(--accent-text)",
                    color: "var(--accent-text)",
                  }}
                >
                  Ver proyectos
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Social links - lower weight */}
              <div className="flex items-center gap-4 text-sm text-[var(--text-2)]">
                <a
                  href="https://github.com/doominguez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  GitHub
                </a>
                <span className="text-[var(--border)]">|</span>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  LinkedIn
                </a>
                <span className="text-[var(--border)]">|</span>
                <EmailLink className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors">
                  <Mail className="w-4 h-4" />
                  Email
                </EmailLink>
              </div>
            </motion.div>
          </div>

          {/* Avatar - 2 columns (solo desktop, en móvil va debajo del subtítulo) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex md:col-span-2 justify-center md:justify-end"
          >
            {avatarContent}
          </motion.div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <a
        href="#proyectos"
        aria-label="Bajar a la sección de proyectos"
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-8 z-10 items-center justify-center text-[var(--text-2)] transition-colors hover:text-[var(--accent)]"
      >
        <svg
          width="24"
          height="38"
          viewBox="0 0 24 38"
          fill="none"
          aria-hidden="true"
          className="block"
        >
          <rect
            x="1.5"
            y="1.5"
            width="21"
            height="35"
            rx="10.5"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <circle
            className="animate-scroll-wheel"
            cx="12"
            cy="9"
            r="1.8"
            fill="currentColor"
          />
        </svg>
      </a>
    </section>
  );
}
