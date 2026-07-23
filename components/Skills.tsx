"use client";

import { motion } from "framer-motion";

interface Skill {
  name: string;
  icon: string;
}

const categorias: { titulo: string; skills: Skill[] }[] = [
  {
    titulo: "Backend",
    skills: [
      { name: "Java", icon: "fa-brands fa-java" },
      { name: "Spring Boot", icon: "fa-solid fa-leaf" },
      { name: "Spring Security", icon: "fa-solid fa-shield-halved" },
      { name: "JPA/Hibernate", icon: "fa-solid fa-database" },
      { name: "REST API", icon: "fa-solid fa-plug" },
      { name: "JWT", icon: "fa-solid fa-key" },
    ],
  },
  {
    titulo: "Bases de datos",
    skills: [
      { name: "MySQL", icon: "fa-solid fa-database" },
      { name: "PostgreSQL", icon: "fa-solid fa-server" },
      { name: "Flyway", icon: "fa-solid fa-plane" },
    ],
  },
  {
    titulo: "Frontend",
    skills: [
      { name: "Angular", icon: "fa-brands fa-angular" },
      { name: "TypeScript", icon: "fa-solid fa-code" },
      { name: "React", icon: "fa-brands fa-react" },
    ],
  },
  {
    titulo: "Herramientas",
    skills: [
      { name: "Git", icon: "fa-brands fa-git" },
      { name: "GitHub", icon: "fa-brands fa-github" },
      { name: "Maven", icon: "fa-solid fa-cube" },
      { name: "Postman", icon: "fa-solid fa-paper-plane" },
    ],
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
    <section id="habilidades" className="section-padding bg-[var(--bg-2)]">
      <div className="container-portfolio">
        <motion.div {...fadeUp}>
          <div className="section-label">02 / Habilidades</div>
          <h2 className="heading-xl mb-16">Habilidades tecnicas</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categorias.map((cat, catIdx) => (
            <motion.div
              key={cat.titulo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIdx * 0.05 }}
            >
              <h3 className="text-sm font-medium text-[var(--text-2)] mb-4 uppercase tracking-wider">
                {cat.titulo}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span key={skill.name} className="chip gap-2">
                    <i className={`${skill.icon} text-sm`} style={{ color: "var(--accent)" }} />
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
