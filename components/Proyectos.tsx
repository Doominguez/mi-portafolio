import { getProyectos, getProyectosDestacados } from "@/lib/proyectos";
import { getSkills } from "@/lib/skills";
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

  const skills = await getSkills();

  return (
    <section id="proyectos" className="section-padding scroll-mt-16">
      <div className="container-portfolio">
        <div className="section-label">01 / Proyectos</div>
        <h2 className="heading-xl mb-4">Proyectos</h2>
        <p className="text-body text-[var(--text-2)] mb-12 max-w-lg">
          Una selección de sistemas y aplicaciones que he diseñado y
          desarrollado.
        </p>
        <ProyectosList destacados={destacados} otros={otros} skills={skills} />
      </div>
    </section>
  );
}
