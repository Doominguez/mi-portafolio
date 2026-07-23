"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ProyectoCardProps {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  tecnologias: string[];
  linkDemo?: string | null;
  linkGithub?: string | null;
}

export default function ProyectoCard({
  id,
  titulo,
  descripcion,
  imagenUrl,
  tecnologias,
  linkDemo,
  linkGithub,
}: ProyectoCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className="card group p-0 overflow-hidden h-full flex flex-col">
      <Link href={`/proyectos/${id}`} className="block overflow-hidden">
        <img
          src={imagenUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop"}
          alt={titulo}
          className="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tecnologias.slice(0, 3).map((tech) => (
            <span key={tech} className="chip text-[10px]">{tech}</span>
          ))}
        </div>

        <Link href={`/proyectos/${id}`}>
          <h3 className="heading-md mb-2 group-hover:text-[var(--accent)] transition-colors">
            {titulo}
          </h3>
        </Link>

        <p className="text-sm text-[var(--text-2)] line-clamp-2 mb-4 flex-1">
          {descripcion}
        </p>

        <div className="flex gap-4 mt-auto">
          {linkDemo && (
            <a
              href={linkDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-[var(--text-2)] hover:text-[var(--accent)] transition-colors"
            >
              Demo
            </a>
          )}
          {linkGithub && (
            <a
              href={linkGithub}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-[var(--text-2)] hover:text-[var(--accent)] transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
