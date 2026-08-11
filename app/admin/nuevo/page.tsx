import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { crearProyecto } from "@/lib/actions";
import ProyectoForm from "@/components/ProyectoForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NuevoProyectoPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

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
        <h1 className="heading-xl">Nuevo proyecto</h1>
      </div>

      <div className="card p-6 sm:p-8">
        <ProyectoForm onSubmit={crearProyecto} submitLabel="Crear proyecto" />
      </div>
    </div>
  );
}
