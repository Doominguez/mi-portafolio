import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getProyectoById } from "@/lib/proyectos";
import { getSkills } from "@/lib/skills";
import { editarProyecto } from "@/lib/actions";
import ProyectoForm from "@/components/ProyectoForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProyectoPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const proyecto = await getProyectoById(id);
  const skills = await getSkills();
  if (!proyecto) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-[var(--text-2)] transition-colors hover:text-[var(--text)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>

      <div>
        <div className="section-label mb-2">Panel de administración</div>
        <h1 className="heading-xl">Editar proyecto</h1>
      </div>

      <div className="card p-6 sm:p-8">
        <ProyectoForm
          initialData={{
            titulo: proyecto.titulo,
            descripcion: proyecto.descripcion,
            imagenUrl: proyecto.imagenUrl,
            linkDemo: proyecto.linkDemo || "",
            linkGithub: proyecto.linkGithub || "",
            tecnologias: proyecto.tecnologias.join(", "),
            destacado: proyecto.destacado,
            screenshots: proyecto.screenshots?.join(", ") || "",
            videoUrl: proyecto.videoUrl || "",
            funcionalidades: proyecto.funcionalidades?.join("\n") || "",
            desafios: proyecto.desafios || "",
            aprendizajes: proyecto.aprendizajes || "",
          }}
          availableSkills={skills}
          onSubmit={editarProyecto}
          submitLabel="Guardar cambios"
          proyectoId={id}
        />
      </div>
    </div>
  );
}
