"use client";

import { motion } from "framer-motion";
import { Plug } from "lucide-react";
import SimpleIcon from "./SimpleIcon";
import { JavaIcon } from "./SocialIcons";

type IconComponent = React.ComponentType<{ className?: string }>;

interface Skill {
  name: string;
  // Slug de Simple Icons (simpleicons.org) o componente lucide/SVG propio
  // para conceptos que no tienen logo de marca (ej. REST API, Java).
  slug?: string;
  icon?: IconComponent;
}

interface Categoria {
  titulo: string;
  cols: 2 | 3;
  skills: Skill[];
  // Fondos pastel que se ciclan entre las tarjetas del bloque.
  pasteles: string[];
}

const pastel = {
  cream: "bg-[var(--pastel-cream)]",
  pink: "bg-[var(--pastel-pink)]",
  blue: "bg-[var(--pastel-blue)]",
  green: "bg-[var(--pastel-green)]",
};

const categorias: Categoria[] = [
  {
    titulo: "Frontend",
    cols: 3,
    skills: [
      { name: "Angular", slug: "angular" },
      { name: "TypeScript", slug: "typescript" },
      { name: "React", slug: "react" },
    ],
    pasteles: [pastel.blue, pastel.pink, pastel.cream],
  },
  {
    titulo: "Backend",
    cols: 3,
    skills: [
      { name: "Java", icon: JavaIcon },
      { name: "Spring Boot", slug: "springboot" },
      { name: "Spring Security", slug: "springsecurity" },
      { name: "JPA/Hibernate", slug: "hibernate" },
      { name: "REST API", icon: Plug },
      { name: "JWT", slug: "jsonwebtokens" },
    ],
    pasteles: [pastel.cream, pastel.pink, pastel.blue, pastel.green],
  },
  {
    titulo: "Herramientas",
    cols: 2,
    skills: [
      { name: "Git", slug: "git" },
      { name: "GitHub", slug: "github" },
      { name: "Maven", slug: "apachemaven" },
      { name: "Postman", slug: "postman" },
    ],
    pasteles: [pastel.blue, pastel.green, pastel.cream, pastel.pink],
  },
  {
    titulo: "Bases de datos",
    cols: 2,
    skills: [
      { name: "MySQL", slug: "mysql" },
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "Flyway", slug: "flyway" },
    ],
    pasteles: [pastel.pink, pastel.blue, pastel.green],
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5 },
};

export default function Skills() {
  return (
    <section className="section-padding bg-[var(--bg-2)]">
      <div id="habilidades" className="container-portfolio scroll-mt-24">
        <motion.div {...fadeUp}>
          <div className="section-label">02 / Habilidades</div>
          <h2 className="heading-xl mb-16">Habilidades técnicas</h2>
        </motion.div>

        <p className="mb-16 -mt-8 max-w-lg text-body text-[var(--text-2)] leading-relaxed">
          Estas son las principales tecnologías y lenguajes en los que tengo
          experiencia y aplico en mis proyectos.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categorias.map((cat, catIdx) => (
            <motion.div
              key={cat.titulo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIdx * 0.05 }}
              className="card p-6 sm:p-8"
            >
              <h3 className="section-label mb-6">{cat.titulo}</h3>

              <div
                className={`grid gap-4 grid-cols-2 ${
                  cat.cols === 3 ? "sm:grid-cols-3" : ""
                }`}
              >
                {cat.skills.map((skill, i) => (
                  <div
                    key={skill.name}
                    className={`flex flex-col items-center justify-center gap-3 rounded-md border border-[var(--border)] p-4 text-center transition-colors hover:border-[var(--text-2)] ${
                      cat.pasteles[i % cat.pasteles.length]
                    }`}
                  >
                    {skill.slug ? (
                      <SimpleIcon
                        slug={skill.slug}
                        className="h-8 w-8 text-[var(--accent)]"
                      />
                    ) : skill.icon ? (
                      <skill.icon className="h-8 w-8 text-[var(--accent)]" />
                    ) : null}
                    <span className="text-sm font-medium leading-tight text-[var(--text)]">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
