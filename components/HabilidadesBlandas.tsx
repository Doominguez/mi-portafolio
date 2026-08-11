"use client";

import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  Lightbulb,
  Clock,
  BookOpen,
  Target,
} from "lucide-react";

const habilidades = [
  { label: "Trabajo en equipo", icon: Users },
  { label: "Comunicacion", icon: MessageSquare },
  { label: "Resolucion de problemas", icon: Lightbulb },
  { label: "Gestión del tiempo", icon: Clock },
  { label: "Aprendizaje continuo", icon: BookOpen },
  { label: "Orientacion a resultados", icon: Target },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5 },
};

export default function HabilidadesBlandas() {
  return (
    <section className="section-padding">
      <div className="container-portfolio">
        <motion.div {...fadeUp}>
          <div className="section-label">03 / Soft skills</div>
          <h2 className="heading-xl mb-16">
            Habilidades blandas
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {habilidades.map((h, i) => {
            const Icon = h.icon;
            return (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex flex-col items-center gap-3 p-5 rounded-md border border-[var(--border)] hover:border-[var(--text-2)] transition-colors"
              >
                <Icon className="w-5 h-5 text-[var(--text-2)]" />
                <span className="text-sm text-center text-[var(--text-2)]">
                  {h.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
