"use client";

import { motion } from "framer-motion";
import { GraduationCap, Globe } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5 },
};

export default function Educacion() {
  return (
    <section className="section-padding bg-[var(--bg-2)]">
      <div id="educacion" className="container-portfolio scroll-mt-24">
        <motion.div {...fadeUp}>
          <div className="section-label">04 / Formación</div>
          <h2 className="heading-xl mb-16">
            Formación e idiomas
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formacion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-5 h-5 text-[var(--text-2)]" />
              <h3 className="heading-md">Formacion academica</h3>
            </div>

            <div>
              <p className="font-medium mb-1">Profesional Tecnico en Computacion e Informatica</p>
              <p className="text-sm text-[var(--text-2)] mb-1">Instituto Cibertec</p>
              <p className="text-xs text-[var(--text-2)] font-mono">2023 — 2026</p>
            </div>
          </motion.div>

          {/* Idiomas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-[var(--text-2)]" />
              <h3 className="heading-md">Idiomas</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Espanol</span>
                <span className="text-xs text-[var(--text-2)] font-mono">Nativo</span>
              </div>
              <div className="w-full h-px bg-[var(--border)]" />
              <div className="flex items-center justify-between">
                <span className="text-sm">Ingles</span>
                <span className="text-xs text-[var(--text-2)] font-mono">Intermedio</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
