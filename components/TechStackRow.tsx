"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { JavaIcon } from "./SocialIcons";
import type { Skill } from "@/lib/skills";

// ---------------------------------------------------------------------------
// Logo resolution – brand logos with official colors via Simple Icons CDN
// ---------------------------------------------------------------------------

type LogoConfig =
  | { type: "simple"; slug: string }
  | { type: "java" }
  | { type: "text" };

const LOGO_MAP: Record<string, LogoConfig> = {
  java: { type: "java" },
  "spring boot": { type: "simple", slug: "springboot" },
  springboot: { type: "simple", slug: "springboot" },
  spring: { type: "simple", slug: "spring" },
  "spring security": { type: "simple", slug: "springsecurity" },
  "jpa/hibernate": { type: "simple", slug: "hibernate" },
  hibernate: { type: "simple", slug: "hibernate" },
  mysql: { type: "simple", slug: "mysql" },
  mariadb: { type: "simple", slug: "mariadb" },
  angular: { type: "simple", slug: "angular" },
  jwt: { type: "simple", slug: "jsonwebtokens" },
  typescript: { type: "simple", slug: "typescript" },
  javascript: { type: "simple", slug: "javascript" },
  maven: { type: "simple", slug: "apachemaven" },
  github: { type: "simple", slug: "github" },
  node: { type: "simple", slug: "nodedotjs" },
  nodejs: { type: "simple", slug: "nodedotjs" },
  "node.js": { type: "simple", slug: "nodedotjs" },
  express: { type: "simple", slug: "express" },
  nest: { type: "simple", slug: "nestjs" },
  nestjs: { type: "simple", slug: "nestjs" },
  react: { type: "simple", slug: "react" },
  vue: { type: "simple", slug: "vuedotjs" },
  vuejs: { type: "simple", slug: "vuedotjs" },
  svelte: { type: "simple", slug: "svelte" },
  "next.js": { type: "simple", slug: "nextdotjs" },
  nextjs: { type: "simple", slug: "nextdotjs" },
  next: { type: "simple", slug: "nextdotjs" },
  postgresql: { type: "simple", slug: "postgresql" },
  postgres: { type: "simple", slug: "postgresql" },
  sqlite: { type: "simple", slug: "sqlite" },
  mongodb: { type: "simple", slug: "mongodb" },
  redis: { type: "simple", slug: "redis" },
  tailwind: { type: "simple", slug: "tailwindcss" },
  "tailwind css": { type: "simple", slug: "tailwindcss" },
  bootstrap: { type: "simple", slug: "bootstrap" },
  css: { type: "simple", slug: "css" },
  html: { type: "simple", slug: "html5" },
  html5: { type: "simple", slug: "html5" },
  sass: { type: "simple", slug: "sass" },
  python: { type: "simple", slug: "python" },
  php: { type: "simple", slug: "php" },
  laravel: { type: "simple", slug: "laravel" },
  git: { type: "simple", slug: "git" },
  docker: { type: "simple", slug: "docker" },
  kubernetes: { type: "simple", slug: "kubernetes" },
  nginx: { type: "simple", slug: "nginx" },
  jenkins: { type: "simple", slug: "jenkins" },
  grafana: { type: "simple", slug: "grafana" },
  prometheus: { type: "simple", slug: "prometheus" },
  c: { type: "simple", slug: "c" },
  go: { type: "simple", slug: "go" },
  rust: { type: "simple", slug: "rust" },
  swift: { type: "simple", slug: "swift" },
  kotlin: { type: "simple", slug: "kotlin" },
  scala: { type: "simple", slug: "scala" },
  firebase: { type: "simple", slug: "firebase" },
  supabase: { type: "simple", slug: "supabase" },
  prisma: { type: "simple", slug: "prisma" },
  sequelize: { type: "simple", slug: "sequelize" },
  typeorm: { type: "simple", slug: "typeorm" },
  eslint: { type: "simple", slug: "eslint" },
  jest: { type: "simple", slug: "jest" },
  vite: { type: "simple", slug: "vite" },
  webpack: { type: "simple", slug: "webpack" },
  npm: { type: "simple", slug: "npm" },
  pnpm: { type: "simple", slug: "pnpm" },
  yarn: { type: "simple", slug: "yarn" },
  redux: { type: "simple", slug: "redux" },
  keycloak: { type: "simple", slug: "keycloak" },
  auth0: { type: "simple", slug: "auth0" },
  postman: { type: "simple", slug: "postman" },
  swagger: { type: "simple", slug: "swagger" },
  vercel: { type: "simple", slug: "vercel" },
  netlify: { type: "simple", slug: "netlify" },
  figma: { type: "simple", slug: "figma" },
  linux: { type: "simple", slug: "linux" },
  ubuntu: { type: "simple", slug: "ubuntu" },
  elasticsearch: { type: "simple", slug: "elasticsearch" },
};

// Slugs whose brand color is black/very dark — invisible on dark backgrounds.
// For these, we force a light color in dark mode via the CDN color parameter.
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

function resolveLogo(tech: string): LogoConfig {
  const normalized = tech.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

  // 1. Special case: Java (must not match javascript)
  if (normalized.includes("java") && !normalized.includes("script")) {
    return { type: "java" };
  }

  // 2. Keyword substring rules
  const rules: { keywords: string[]; slug: string }[] = [
    { keywords: ["springboot"], slug: "springboot" },
    { keywords: ["springsecurity"], slug: "springsecurity" },
    { keywords: ["springdata", "springcloud", "spring"], slug: "spring" },
    { keywords: ["hibernate", "jpa"], slug: "hibernate" },
    { keywords: ["angular"], slug: "angular" },
    { keywords: ["mysql"], slug: "mysql" },
    { keywords: ["postgres", "postgresql"], slug: "postgresql" },
    { keywords: ["mariadb"], slug: "mariadb" },
    { keywords: ["jwt", "jsonwebtoken"], slug: "jsonwebtokens" },
    { keywords: ["typescript", "ts"], slug: "typescript" },
    { keywords: ["javascript", "js"], slug: "javascript" },
    { keywords: ["maven"], slug: "apachemaven" },
    { keywords: ["docker"], slug: "docker" },
    { keywords: ["kubernetes", "k8s"], slug: "kubernetes" },
    { keywords: ["rest", "http", "api"], slug: "http" },
    { keywords: ["react"], slug: "react" },
    { keywords: ["next"], slug: "nextdotjs" },
    { keywords: ["vue"], slug: "vuedotjs" },
    { keywords: ["node"], slug: "nodedotjs" },
    { keywords: ["express"], slug: "express" },
    { keywords: ["nest"], slug: "nestjs" },
    { keywords: ["tail"], slug: "tailwindcss" },
    { keywords: ["bootstra"], slug: "bootstrap" },
    { keywords: ["html"], slug: "html5" },
    { keywords: ["css", "scss", "sass"], slug: "css" },
    { keywords: ["git"], slug: "git" },
    { keywords: ["github"], slug: "github" },
    { keywords: ["mongo"], slug: "mongodb" },
    { keywords: ["redis"], slug: "redis" },
    { keywords: ["python"], slug: "python" },
    { keywords: ["php"], slug: "php" },
    { keywords: ["laravel"], slug: "laravel" },
    { keywords: ["prisma"], slug: "prisma" },
    { keywords: ["postman"], slug: "postman" },
    { keywords: ["swagger"], slug: "swagger" },
    { keywords: ["vercel"], slug: "vercel" },
    { keywords: ["netlify"], slug: "netlify" },
    { keywords: ["figma"], slug: "figma" },
    { keywords: ["linux", "ubuntu"], slug: "linux" },
    { keywords: ["rabbit"], slug: "rabbitmq" },
    { keywords: ["socket"], slug: "socketdotio" },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      return { type: "simple", slug: rule.slug };
    }
  }

  const exactKey = tech.trim().toLowerCase().replace(/\s+/g, " ");
  if (LOGO_MAP[exactKey]) {
    return LOGO_MAP[exactKey];
  }

  return { type: "text" };
}

// ---------------------------------------------------------------------------
// useIsDark – watches the .dark class on <html>
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Build CDN URL with color for dark mode
// ---------------------------------------------------------------------------

function buildIconUrl(slug: string, isDark: boolean): string {
  if (isDark && DARK_BRAND_SLUGS.has(slug)) {
    // Force a visible light color in dark mode
    return `https://cdn.simpleicons.org/${slug}/e0e0e0`;
  }
  return `https://cdn.simpleicons.org/${slug}`;
}

// ---------------------------------------------------------------------------
// TechBadge – single technology icon with tooltip
// ---------------------------------------------------------------------------

interface TechBadgeProps {
  tech: string;
  logoUrl?: string;
  isDark: boolean;
}

function TechBadge({ tech, logoUrl, isDark }: TechBadgeProps) {
  const config = resolveLogo(tech);

  const iconEl = (() => {
    if (logoUrl) {
      return (
        <img
          src={logoUrl}
          alt={tech}
          loading="lazy"
          className="w-6 h-6 object-contain flex-shrink-0"
        />
      );
    }
    if (config.type === "java") {
      return <JavaIcon className="w-6 h-6 flex-shrink-0" />;
    }
    if (config.type === "simple") {
      return (
        <img
          src={buildIconUrl(config.slug, isDark)}
          alt={tech}
          loading="lazy"
          className="w-6 h-6 object-contain flex-shrink-0"
          draggable={false}
        />
      );
    }
    return null;
  })();

  return (
    <span className="tech-stack-icon" role="img" aria-label={tech}>
      {iconEl ?? <span className="tech-stack-text-pill">{tech}</span>}
      <span className="tech-stack-tooltip" aria-hidden="true">{tech}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// TechStackRow – shows first MAX_VISIBLE icons, expands the rest inline below
// ---------------------------------------------------------------------------

const MAX_VISIBLE = 8;

interface TechStackRowProps {
  techs: string[];
  skills?: Skill[];
}

export default function TechStackRow({ techs, skills }: TechStackRowProps) {
  const [expanded, setExpanded] = useState(false);
  const isDark = useIsDark();

  const skillLogoByNombre = new Map(
    (skills || []).map((s) => [s.nombre.toLowerCase(), s.logoUrl]),
  );

  const visible = techs.slice(0, MAX_VISIBLE);
  const hidden = techs.slice(MAX_VISIBLE);
  const hasMore = hidden.length > 0;

  return (
    <div className="tech-stack-container">
      {/* First row: always-visible icons + expand button */}
      <div
        className="tech-stack-row"
        role="list"
        aria-label="Stack de tecnologias"
      >
        {visible.map((tech) => (
          <span key={tech} role="listitem">
            <TechBadge
              tech={tech}
              logoUrl={skillLogoByNombre.get(tech.toLowerCase())}
              isDark={isDark}
            />
          </span>
        ))}

        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={
              expanded
                ? "Ocultar tecnologias adicionales"
                : `Ver ${hidden.length} tecnologia${hidden.length === 1 ? "" : "s"} mas`
            }
            className="tech-stack-expand-btn"
            title={expanded ? "Ocultar" : `+${hidden.length} mas`}
          >
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Expanded section: hidden icons appear below with animation */}
      {hasMore && expanded && (
        <div
          className="tech-stack-expanded"
          role="list"
          aria-label="Tecnologias adicionales"
        >
          {hidden.map((tech) => (
            <span key={tech} role="listitem">
              <TechBadge
                tech={tech}
                logoUrl={skillLogoByNombre.get(tech.toLowerCase())}
                isDark={isDark}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
