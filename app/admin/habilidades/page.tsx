import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, LayoutGrid } from "lucide-react";
import { getSkills } from "@/lib/skills";
import { eliminarSkill } from "@/lib/actions";
import DeleteSkillButton from "@/components/admin/DeleteSkillButton";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const skills = await getSkills();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="section-label mb-2">Panel de administración</div>
          <h1 className="heading-xl">Habilidades técnicas</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/habilidades/nuevo" className="btn-primary">
            <Plus className="h-4 w-4" />
            Nuevo logo
          </Link>
          <Link href="/admin" className="btn-secondary">
            <LayoutGrid className="h-4 w-4" />
            Volver a proyectos
          </Link>
        </div>
      </div>

      {skills.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 p-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-2)]">
            <LayoutGrid className="h-6 w-6" />
          </span>
          <div>
            <h2 className="heading-md">No hay logos cargados</h2>
            <p className="mt-1 text-sm text-[var(--text-2)]">
              Agregá tus logos ahora para que se muestren en la sección de
              habilidades.
            </p>
          </div>
          <Link
            href="/admin/habilidades/nuevo"
            className="btn-secondary text-sm"
          >
            Agregar logo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {skills.map((skill) => (
            <article
              key={skill.id}
              className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
            >
              <div className="h-20 w-full shrink-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] sm:w-20">
                <img
                  src={skill.logoUrl}
                  alt={skill.nombre}
                  className="h-full w-full object-contain p-3"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="heading-md truncate">{skill.nombre}</h3>
                <p className="mt-1 text-sm text-[var(--text-2)]">
                  {skill.categoria}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/habilidades/${skill.id}/editar`}
                  className="flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-2)] transition-colors hover:border-[var(--text-2)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Link>
                <DeleteSkillButton onDelete={eliminarSkill} id={skill.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
