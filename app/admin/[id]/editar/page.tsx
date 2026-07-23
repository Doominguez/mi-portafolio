import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getProyectoById } from "@/lib/proyectos";
import { editarProyecto } from "@/lib/actions";
import ProyectoForm from "@/components/ProyectoForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProyectoPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const proyecto = await getProyectoById(id);
  if (!proyecto) notFound();

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin"
          className="text-sm text-neutral-500 underline-offset-4 hover:underline dark:text-neutral-400"
        >
          &larr; Volver
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          Editar proyecto
        </h1>

        <div className="mt-8">
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
            onSubmit={editarProyecto}
            submitLabel="Guardar cambios"
            proyectoId={id}
          />
        </div>
      </div>
    </div>
  );
}
