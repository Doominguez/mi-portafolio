import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import { getProyectoById } from "@/lib/proyectos";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const proyecto = await getProyectoById(id);
  if (!proyecto) return { title: "Proyecto no encontrado" };

  return {
    title: `${proyecto.titulo} | Junior Dominguez Montero`,
    description: proyecto.descripcion,
  };
}

export default async function ProyectoDetalle({ params }: Props) {
  const { id } = await params;
  const proyecto = await getProyectoById(id);

  if (!proyecto) notFound();

  return (
    <section className="section-padding pt-32 md:pt-40">
      <div className="container-portfolio max-w-4xl">
        <Link
          href="/#proyectos"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-2)] hover:text-[var(--accent)] transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <div className="card p-0 overflow-hidden mb-10">
          <img
            src={proyecto.imagenUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop"}
            alt={proyecto.titulo}
            className="w-full aspect-video object-cover"
            style={{ viewTransitionName: `project-hero-${proyecto.id}`, viewTransitionClass: "project-morph" }}
          />
        </div>

        <h1 className="heading-lg mb-6" style={{ viewTransitionName: "hero-title", viewTransitionClass: "title-morph" }}>
          {proyecto.titulo}
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {proyecto.tecnologias.map((tech) => (
            <span key={tech} className="chip">{tech}</span>
          ))}
        </div>

        <div className="divider mb-8" />

        <p className="text-body text-[var(--text-2)] max-w-3xl mb-10">
          {proyecto.descripcion}
        </p>

        <div className="flex flex-wrap gap-3">
          {proyecto.linkGithub && (
            <a
              href={proyecto.linkGithub}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <GithubIcon className="w-4 h-4" />
              Ver codigo
            </a>
          )}
          {proyecto.linkDemo && (
            <a
              href={proyecto.linkDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <ExternalLink className="w-4 h-4" />
              Ver demo
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
