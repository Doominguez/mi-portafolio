import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { crearProyecto } from "@/lib/actions";
import ProyectoForm from "@/components/ProyectoForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NuevoProyectoPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

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
          Nuevo proyecto
        </h1>

        <div className="mt-8">
          <ProyectoForm
            onSubmit={crearProyecto}
            submitLabel="Crear proyecto"
          />
        </div>
      </div>
    </div>
  );
}
