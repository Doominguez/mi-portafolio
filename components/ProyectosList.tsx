"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProjectCard, { type Proyecto } from "./ProjectCard";
import ProyectoModal from "./ProyectoModal";
import type { Skill } from "@/lib/skills";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5 },
};

export default function ProyectosList({
  destacados,
  otros,
  skills,
}: {
  destacados: Proyecto[];
  otros: Proyecto[];
  skills: Skill[];
}) {
  const allProjects = [...destacados, ...otros];
  const [selected, setSelected] = useState<Proyecto | null>(null);

  if (allProjects.length === 0) {
    return (
      <div className="py-20 text-center text-[var(--text-2)]">
        <p className="text-body">Aun no hay proyectos para mostrar.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-8">
        {allProjects.map((proyecto, i) => (
          <motion.div
            key={proyecto.id}
            {...fadeUp}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
            className="w-full md:w-[calc((100%-32px)/2)] lg:w-[calc((100%-64px)/3)]"
          >
            <ProjectCard
              proyecto={proyecto}
              index={i}
              total={allProjects.length}
              onDetalles={setSelected}
            />
          </motion.div>
        ))}
      </div>

      <ProyectoModal proyecto={selected} onClose={() => setSelected(null)} skills={skills} />
    </>
  );
}
