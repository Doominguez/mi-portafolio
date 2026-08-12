"use client";

import { motion } from "framer-motion";

type SkillItem = {
  id: string;
  nombre: string;
  categoria: string;
  logoUrl: string;
  orden: number;
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5 },
};

interface SkillsProps {
  skills: SkillItem[];
}

const CATEGORY_ORDER = ["Backend", "Frontend", "Base de datos", "Herramientas"];

export default function Skills({ skills }: SkillsProps) {
  const categories = skills.reduce<Record<string, SkillItem[]>>(
    (acc, skill) => {
      acc[skill.categoria] = acc[skill.categoria] || [];
      acc[skill.categoria].push(skill);
      return acc;
    },
    {},
  );

  const orderedCategories = [
    ...CATEGORY_ORDER.filter((categoria) => categoria in categories),
    ...Object.keys(categories).filter(
      (categoria) => !CATEGORY_ORDER.includes(categoria),
    ),
  ];

  return (
    <section className="section-padding bg-[var(--bg-2)]">
      <div id="habilidades" className="container-portfolio scroll-mt-24">
        <motion.div {...fadeUp}>
          <div className="section-label">02 / Habilidades</div>
          <h2 className="heading-xl mb-10">Habilidades técnicas</h2>
        </motion.div>

        <p className="mb-12 -mt-6 max-w-xl text-body text-[var(--text-2)] leading-relaxed">
          Estas son algunas de las tecnologías y lenguajes de programación que
          manejo y que he utilizado en mis proyectos.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {orderedCategories.map((categoria, index) => (
            <motion.div
              key={categoria}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
            >
              <div className="mb-5">
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--text)]">
                  {categoria}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {categories[categoria]
                  .slice()
                  .sort((a, b) => a.orden - b.orden)
                  .map((skill) => (
                    <article
                      key={skill.id}
                      className="flex flex-col items-center gap-2 rounded-[22px] border border-[var(--border)] bg-[var(--bg)] p-3 text-center transition-colors duration-200 hover:border-[var(--accent)]"
                    >
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[var(--surface)] p-2">
                        <img
                          src={skill.logoUrl}
                          alt={skill.nombre}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--text)]">
                        {skill.nombre}
                      </span>
                    </article>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
