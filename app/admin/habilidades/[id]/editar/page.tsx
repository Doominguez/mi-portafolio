import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getSkillById } from "@/lib/skills";
import { editarSkill } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SkillForm from "@/components/SkillForm";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditarSkillPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const skill = await getSkillById(id);
  if (!skill) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/habilidades"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-[var(--text-2)] transition-colors hover:text-[var(--text)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a habilidades
      </Link>

      <div>
        <div className="section-label mb-2">Panel de administración</div>
        <h1 className="heading-xl">Editar logo</h1>
      </div>

      <div className="card p-6 sm:p-8">
        <SkillForm
          initialData={{
            id: skill.id,
            nombre: skill.nombre,
            categoria: skill.categoria,
            logoUrl: skill.logoUrl,
            orden: skill.orden,
          }}
          onSubmit={editarSkill}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
}
