import { getProyectos, getProyectosDestacados } from "@/lib/proyectos";
import ProyectosList from "./ProyectosList";

export default async function Proyectos() {
  let destacados: Awaited<ReturnType<typeof getProyectosDestacados>> = [];
  let otros: Awaited<ReturnType<typeof getProyectos>> = [];

  try {
    destacados = await getProyectosDestacados();
    const todos = await getProyectos();
    otros = todos.filter((p) => !p.destacado);
  } catch {
    destacados = [];
    otros = [];
  }

  return (
    <section className="section-padding">
      <div id="proyectos" className="container-portfolio scroll-mt-24">
        <div className="section-label">01 / Proyectos</div>
        <h2 className="heading-xl mb-4">Proyectos</h2>
        <p className="text-body text-[var(--text-2)] mb-16 max-w-lg">
          Una selección de sistemas y aplicaciones que he diseñado y
          desarrollado.
        </p>
        <ProyectosList destacados={destacados} otros={otros} />
      </div>
    </section>
  );
}
