import SimpleIcon from "./SimpleIcon";
import { JavaIcon } from "./SocialIcons";

// Renderiza el logo real de una tecnología y muestra el nombre al hacer
// hover. Las tecnologías sin logo conocido se muestran como pill de texto
// para no perder información.
//
// Los slugs corresponden a Simple Icons (simpleicons.org). Java no existe
// en Simple Icons, así que usa el logo SVG propio (JavaIcon).
type LogoConfig = { type: "simple"; slug: string } | { type: "java" };

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
  markdown: { type: "simple", slug: "markdown" },
  json: { type: "simple", slug: "json" },
  yaml: { type: "simple", slug: "yaml" },
  xml: { type: "simple", slug: "xml" },
};

function resolveLogo(tech: string): LogoConfig | null {
  const key = tech.trim().toLowerCase().replace(/\s+/g, " ");
  return LOGO_MAP[key] ?? null;
}

interface TechLogoProps {
  tech: string;
  size?: "sm" | "md";
  /** Logo propio del admin (skills.logoUrl). Si se pasa, se usa ese logo
   *  en vez de resolver el slug de Simple Icons. */
  logoUrl?: string;
}

export default function TechLogo({ tech, size = "md", logoUrl }: TechLogoProps) {
  const boxClass = size === "sm" ? "tech-logo tech-logo-sm" : "tech-logo";
  const iconClass =
    size === "sm" ? "w-[24px] h-[24px]" : "w-[22px] h-[22px]";

  if (logoUrl) {
    return (
      <span className={boxClass} role="img" aria-label={tech}>
        <img
          src={logoUrl}
          alt={tech}
          loading="lazy"
          className={`${iconClass} object-contain`}
        />
        <span className="tech-tooltip" aria-hidden="true">
          {tech}
        </span>
      </span>
    );
  }

  const config = resolveLogo(tech);

  if (!config) {
    return <span className="tech-pill">{tech}</span>;
  }

  return (
    <span className={boxClass} role="img" aria-label={tech}>
      {config.type === "java" ? (
        <JavaIcon className={iconClass} />
      ) : (
        <SimpleIcon slug={config.slug} className={iconClass} />
      )}
      <span className="tech-tooltip" aria-hidden="true">
        {tech}
      </span>
    </span>
  );
}
