"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Server, Database, Layout, Wrench, Sparkles, Cpu } from "lucide-react";
import { JavaIcon } from "./SocialIcons";

type SkillItem = {
  id: string;
  nombre: string;
  categoria: string;
  logoUrl: string;
  orden: number;
};

interface SkillsProps {
  skills: SkillItem[];
}

const CATEGORY_ORDER = ["Backend", "Base de datos", "Frontend", "Herramientas"];

const CATEGORY_ICONS: Record<string, typeof Server> = {
  Backend: Server,
  "Base de datos": Database,
  Frontend: Layout,
  Herramientas: Wrench,
};

const DARK_BRAND_SLUGS = new Set([
  "jsonwebtokens",
  "express",
  "nextdotjs",
  "github",
  "vercel",
  "markdown",
  "json",
  "prisma",
  "linux",
]);

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5 },
};

function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains("dark"));
    });
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export default function Skills({ skills }: SkillsProps) {
  const isDark = useIsDark();

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

  const getLogoUrl = (logoUrl: string) => {
    if (isDark && logoUrl.includes("cdn.simpleicons.org/")) {
      const parts = logoUrl.split("cdn.simpleicons.org/");
      if (parts[1]) {
        const slug = parts[1].split("/")[0];
        if (DARK_BRAND_SLUGS.has(slug)) {
          return `https://cdn.simpleicons.org/${slug}/e0e0e0`;
        }
      }
    }
    return logoUrl;
  };

  return (
    <section id="habilidades" className="section-padding bg-[var(--bg)] text-[var(--text)] relative overflow-hidden transition-colors duration-300 scroll-mt-16">
      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-25"
        style={{
          backgroundImage: `radial-gradient(var(--border) 1px, transparent 1px)`,
          backgroundSize: `24px 24px`,
        }}
      />

      <div className="container-portfolio relative z-10">
        {/* Header Section */}
        <motion.div {...fadeUp} className="mb-12">
          <div className="section-label">02 / Habilidades</div>
          <h2 className="heading-xl">Habilidades Técnicas</h2>
        </motion.div>

        {/* Vertical Category Rows */}
        <div className="flex flex-col gap-10">
          {orderedCategories.map((categoria, catIndex) => {
            const CategoryIcon = CATEGORY_ICONS[categoria] || Sparkles;
            const skillItems = (categories[categoria] || [])
              .slice()
              .sort((a, b) => a.orden - b.orden);

            return (
              <motion.div
                key={categoria}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: catIndex * 0.06 }}
                className="flex flex-col gap-4"
              >
                {/* Category Row Title */}
                <div className="flex items-center gap-2.5">
                  <CategoryIcon className="w-5 h-5 text-[var(--accent-text)]" />
                  <h3 className="text-xl font-bold tracking-tight text-[var(--text)]">
                    {categoria}
                  </h3>
                </div>

                {/* 4-Column Horizontal Pill/Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {skillItems.map((skill) => {
                    const isJava =
                      skill.nombre.toLowerCase().includes("java") &&
                      !skill.nombre.toLowerCase().includes("javascript");

                    return (
                      <div
                        key={skill.id}
                        className="group flex items-center gap-3.5 p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                        title={skill.nombre}
                      >
                        {/* Left Icon Container */}
                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-2)] dark:bg-[#282834] border border-[var(--border)] dark:border-[#3e3e4d] group-hover:border-[var(--accent)]/40 p-2 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                          {isJava ? (
                            <JavaIcon className="w-6 h-6 object-contain" />
                          ) : (
                            <img
                              src={getLogoUrl(skill.logoUrl)}
                              alt={skill.nombre}
                              className="w-6 h-6 object-contain"
                              loading="lazy"
                            />
                          )}
                        </div>

                        {/* Right Label — no truncate so names like Java 21, Spring Boot, Docker never show Ja..., Re... */}
                        <span className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent-text)] transition-colors leading-tight">
                          {skill.nombre}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
