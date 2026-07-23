"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GithubIcon } from "./SocialIcons";
import ProyectoModal from "./ProyectoModal";

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

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5 },
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop";

export default function ProyectosList({
  destacados,
  otros,
}: {
  destacados: Proyecto[];
  otros: Proyecto[];
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProjects.map((proyecto) => (
          <motion.div
            key={proyecto.id}
            {...fadeUp}
            className="card overflow-hidden flex flex-col"
          >
            <Link href={`/proyectos/${proyecto.id}`} className="block">
              <div className="relative aspect-video">
                <img
                  src={proyecto.imagenUrl || FALLBACK_IMG}
                  alt={proyecto.titulo}
                  className="w-full h-full object-cover"
                />
                {proyecto.destacado && (
                  <div className="absolute top-3 left-3">
                    <span
                      className="chip text-[11px] font-semibold"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      Destacado
                    </span>
                  </div>
                )}
              </div>
            </Link>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="heading-md mb-2">{proyecto.titulo}</h3>
              <p
                className="text-sm text-[var(--text)]/70 mb-5 line-clamp-2 flex-1"
                style={{ fontWeight: 450 }}
              >
                {proyecto.descripcion}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {proyecto.tecnologias.map((tech) => (
                  <span key={tech} className="chip text-[11px] px-2 py-1">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-auto">
                {proyecto.linkGithub && (
                  <a
                    href={proyecto.linkGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs px-4 py-2"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    Codigo
                  </a>
                )}
                <button
                  onClick={() => setSelected(proyecto)}
                  className="btn-primary text-xs px-4 py-2"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ProyectoModal proyecto={selected} onClose={() => setSelected(null)} />
    </>
  );
}
