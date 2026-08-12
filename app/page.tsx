import Hero from "@/components/Hero";
import Proyectos from "@/components/Proyectos";
import Skills from "@/components/Skills";
import HabilidadesBlandas from "@/components/HabilidadesBlandas";
import Educacion from "@/components/Educacion";
import Contacto from "@/components/Contacto";
import { getSkills } from "@/lib/skills";

export default async function Home() {
  const skills = await getSkills();

  return (
    <>
      <Hero />
      <Proyectos />
      <Skills skills={skills} />
      <HabilidadesBlandas />
      <Educacion />
      <Contacto />
    </>
  );
}
