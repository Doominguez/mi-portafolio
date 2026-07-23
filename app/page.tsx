import Hero from "@/components/Hero";
import Proyectos from "@/components/Proyectos";
import Skills from "@/components/Skills";
import HabilidadesBlandas from "@/components/HabilidadesBlandas";
import Educacion from "@/components/Educacion";
import Contacto from "@/components/Contacto";

export default function Home() {
  return (
    <>
      <Hero />
      <Proyectos />
      <Skills />
      <HabilidadesBlandas />
      <Educacion />
      <Contacto />
    </>
  );
}
