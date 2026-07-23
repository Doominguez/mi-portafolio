"use client";

import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";

const contactos = [
  {
    label: "Email",
    value: "Juniordomontero@gmail.com",
    href: "mailto:Juniordomontero@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "github.com/doominguez",
    href: "https://github.com/doominguez",
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    value: "LinkedIn",
    href: "#",
    icon: LinkedinIcon,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5 },
};

export default function Contacto() {
  return (
    <section id="contacto" className="section-padding">
      <div className="container-portfolio">
        <motion.div {...fadeUp}>
          <div className="section-label">05 / Contacto</div>
          <h2 className="heading-xl mb-6">
            Contacto
          </h2>
          <p className="text-body text-[var(--text-2)] mb-16 max-w-lg">
            Si tienes una oportunidad o quieres colaborar, estoy disponible.
          </p>
        </motion.div>

        <div className="max-w-xl">
          {contactos.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group flex items-center gap-4 py-5 border-b border-[var(--border)]"
              >
                <Icon className="w-5 h-5 text-[var(--text-2)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--text-2)] mb-1 uppercase tracking-wider font-mono">
                    {c.label}
                  </p>
                  <p className="text-base font-medium truncate group-hover:text-[var(--accent)] transition-colors">
                    {c.value}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-2)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
