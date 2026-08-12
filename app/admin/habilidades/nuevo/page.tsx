import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { crearSkill } from "@/lib/actions";
import SkillForm from "@/components/SkillForm";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NuevoSkillPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

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
        <h1 className="heading-xl">Nuevo logo</h1>
      </div>

      <div className="card p-6 sm:p-8">
        <SkillForm onSubmit={crearSkill} submitLabel="Crear logo" />
      </div>
    </div>
  );
}
