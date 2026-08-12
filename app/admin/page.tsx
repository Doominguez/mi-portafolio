import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, LayoutGrid, ArrowRight } from "lucide-react";
import { getProyectos } from "@/lib/proyectos";
import { eliminarProyecto } from "@/lib/actions";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import ProyectoImagePlaceholder, {
  isGenericImage,
} from "@/components/ProyectoImagePlaceholder";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const proyectos = await getProyectos();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="section-label mb-2">Panel de administración</div>
          <h1 className="heading-xl">Mis Proyectos</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/habilidades" className="btn-secondary">
            <LayoutGrid className="h-4 w-4" />
            Gestionar logos
          </Link>
          <Link href="/admin/nuevo" className="btn-primary">
            <Plus className="h-4 w-4" />
            Nuevo proyecto
          </Link>
        </div>
      </div>

      {proyectos.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 p-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-2)]">
            <LayoutGrid className="h-6 w-6" />
          </span>
          <div>
            <h2 className="heading-md">No hay proyectos todavía</h2>
            <p className="mt-1 text-sm text-[var(--text-2)]">
              Creá tu primer proyecto para verlo en el portafolio.
            </p>
          </div>
          <Link href="/admin/nuevo" className="btn-secondary text-sm">
            Crear el primero
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {proyectos.map((p) => (
            <article
              key={p.id}
              className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
            >
              <div className="h-16 w-full shrink-0 overflow-hidden rounded-lg sm:w-24">
                {p.imagenUrl && !isGenericImage(p.imagenUrl) ? (
                  <img
                    src={p.imagenUrl}
                    alt={p.titulo}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ProyectoImagePlaceholder
                    titulo={p.titulo}
                    tecnologiaPrincipal={p.tecnologias[0]}
                    className="h-full w-full"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="heading-md truncate">{p.titulo}</h3>
                  {p.destacado && (
                    <span className="inline-flex shrink-0 items-center rounded-full bg-[rgba(0,115,150,0.16)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                      Destacado
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.tecnologias.slice(0, 4).map((t) => (
                    <span key={t} className="tech-pill">
                      {t}
                    </span>
                  ))}
                  {p.tecnologias.length > 4 && (
                    <span className="tech-pill">
                      +{p.tecnologias.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/${p.id}/editar`}
                  className="flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-2)] transition-colors hover:border-[var(--text-2)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Link>
                <DeleteProjectButton onDelete={eliminarProyecto} id={p.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
