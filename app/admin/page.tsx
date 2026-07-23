import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getProyectos } from "@/lib/proyectos";
import { eliminarProyecto } from "@/lib/actions";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const proyectos = await getProyectos();

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Mis Proyectos
          </h1>
          <div className="flex items-center gap-3">
            <LogoutButton />
            <Link
              href="/admin/nuevo"
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              + Nuevo proyecto
            </Link>
          </div>
        </div>

        {proyectos.length === 0 ? (
          <p className="mt-10 text-neutral-500 dark:text-neutral-400">
            No hay proyectos aun. Creá uno nuevo.
          </p>
        ) : (
          <div className="mt-8 space-y-4">
            {proyectos.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <img
                  src={p.imagenUrl}
                  alt={p.titulo}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                    {p.titulo}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {p.tecnologias.join(", ")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/${p.id}/editar`}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await eliminarProyecto(p.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
