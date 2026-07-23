"use client";

import { motion } from "framer-motion";
import { Mail, Download, ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center relative">
      {/* Subtle background gradient for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 40%, var(--surface) 0%, transparent 70%)",
        }}
      />

      <div className="container-portfolio py-32 md:py-0 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 items-center">
          {/* Text - 3 columns */}
          <div className="md:col-span-3">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-3"
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
              className="text-lg md:text-xl font-medium text-[var(--accent)] mb-6"
            >
              Desarrollador Backend{" "}
              <span className="inline-flex items-center gap-1.5">
                Java{" "}
                <i
                  className="fa-brands fa-java"
                  style={{ color: "var(--accent)" }}
                />
              </span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-body text-[var(--text-2)] mb-8 max-w-xl leading-relaxed"
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
                    borderColor: "var(--accent)",
                    color: "var(--accent)",
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
                <a
                  href="mailto:Juniordomontero@gmail.com"
                  className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </div>
            </motion.div>
          </div>

          {/* Avatar - 2 columns */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2 flex justify-center md:justify-end"
          >
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
                className="relative w-[220px] h-[220px] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
