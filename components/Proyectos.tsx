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
    <section id="proyectos" className="section-padding">
      <div className="container-portfolio">
        <div className="section-label">01 / Proyectos</div>
        <h2 className="heading-xl mb-16">
          Proyectos
        </h2>
        <ProyectosList destacados={destacados} otros={otros} />
      </div>
    </section>
  );
}
