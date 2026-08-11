/**
 * Vista previa generada para proyectos que aún no tienen una captura real.
 *
 * En vez de fotos de stock (manos con post-its, gente en oficinas) o letras
 * gigantes, generamos un mockup determinista de "aplicación" (mismo proyecto
 * → mismo resultado siempre) a partir del título: barra de navegación,
 * sidebar, tarjetas de contenido y un gráfico de barras, con paletas frías
 * derivadas del acento #007396.
 *
 * Esto se ve intencional en el portafolio y le comunica al visitante qué tipo
 * de interfaz encontrará, hasta que reemplaces `imagenUrl` por una captura
 * real del proyecto. Cuando subas la captura real, este componente deja de
 * usarse automáticamente.
 */

// Paletas frías/profesionales derivadas de #007396, coherentes entre sí para
// que no choquen visualmente cuando varias cards aparecen juntas en el grid.
const PALETTES = [
  { from: "#0e7490", to: "#00202b", glow: "rgba(0, 115, 150, 0.3)" },
  { from: "#0f766e", to: "#042f2a", glow: "rgba(0, 115, 150, 0.24)" },
  { from: "#1e40af", to: "#0f172a", glow: "rgba(0, 115, 150, 0.2)" },
  { from: "#334155", to: "#0a0f1a", glow: "rgba(0, 115, 150, 0.22)" },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(titulo: string): string {
  const cleanTitle = titulo.split(/[—–-]/)[0].trim();
  const words = cleanTitle.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Heurística para detectar imágenes de stock/placeholder (ej. Unsplash)
 * vs. capturas reales subidas por el usuario. Ajusta `MARKERS` si usas
 * otro proveedor de imágenes de relleno.
 */
const GENERIC_IMAGE_MARKERS = ["images.unsplash.com", "unsplash.com"];

export function isGenericImage(url: string | null | undefined): boolean {
  if (!url) return true;
  return GENERIC_IMAGE_MARKERS.some((marker) => url.includes(marker));
}

interface ProyectoImagePlaceholderProps {
  titulo: string;
  tecnologiaPrincipal?: string;
  className?: string;
}

export default function ProyectoImagePlaceholder({
  titulo,
  tecnologiaPrincipal,
  className = "",
}: ProyectoImagePlaceholderProps) {
  const hash = hashString(titulo);
  const palette = PALETTES[hash % PALETTES.length];
  const initials = getInitials(titulo);
  const angle = 18 + (hash % 22);
  const uid = hash.toString(36);

  return (
    <svg
      viewBox="0 0 800 450"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Vista previa del proyecto ${titulo} — sube una captura real para reemplazarla`}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="75%" cy="15%" r="85%">
          <stop offset="0%" stopColor={palette.glow} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <pattern
          id={`grid-${uid}`}
          width="34"
          height="34"
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${angle})`}
        >
          <path
            d="M 34 0 L 0 0 0 34"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {/* Fondo */}
      <rect width="800" height="450" fill={`url(#bg-${uid})`} />
      <rect width="800" height="450" fill={`url(#grid-${uid})`} />
      <rect width="800" height="450" fill={`url(#glow-${uid})`} />

      {/* Barra del navegador */}
      <rect width="800" height="52" fill="rgba(0,0,0,0.35)" />
      <circle cx="34" cy="26" r="6" fill="rgba(255,255,255,0.25)" />
      <circle cx="56" cy="26" r="6" fill="rgba(255,255,255,0.25)" />
      <circle cx="78" cy="26" r="6" fill="rgba(255,255,255,0.25)" />
      <rect x="140" y="15" width="420" height="22" rx="11" fill="rgba(255,255,255,0.08)" />
      <text
        x="350"
        y="30"
        textAnchor="middle"
        fontFamily="var(--font-mono), 'JetBrains Mono', monospace"
        fontSize="11"
        letterSpacing="1.5"
        fill="rgba(255,255,255,0.5)"
      >
        {(tecnologiaPrincipal ?? "proyecto").toUpperCase()}
      </text>
      <rect x="680" y="15" width="64" height="22" rx="11" fill="rgba(0,115,150,0.35)" />

      {/* Sidebar */}
      <rect x="48" y="84" width="116" height="330" rx="14" fill="rgba(255,255,255,0.05)" />
      <circle cx="72" cy="108" r="9" fill="rgba(0,115,150,0.55)" />
      <rect x="92" y="101" width="58" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
      <rect x="68" y="130" width="80" height="9" rx="4.5" fill="rgba(255,255,255,0.07)" />
      <rect x="68" y="150" width="80" height="9" rx="4.5" fill="rgba(0,115,150,0.4)" />
      <rect x="68" y="170" width="80" height="9" rx="4.5" fill="rgba(255,255,255,0.07)" />
      <rect x="68" y="190" width="80" height="9" rx="4.5" fill="rgba(255,255,255,0.07)" />
      <rect x="68" y="210" width="80" height="9" rx="4.5" fill="rgba(255,255,255,0.07)" />

      {/* Tarjeta principal */}
      <rect
        x="192"
        y="84"
        width="292"
        height="150"
        rx="14"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(0,115,150,0.35)"
        strokeWidth="1.5"
      />
      <rect x="216" y="110" width="170" height="13" rx="6.5" fill="rgba(255,255,255,0.2)" />
      <rect x="216" y="134" width="120" height="9" rx="4.5" fill="rgba(255,255,255,0.09)" />
      <rect x="216" y="150" width="150" height="9" rx="4.5" fill="rgba(255,255,255,0.09)" />
      <rect x="216" y="196" width="88" height="22" rx="11" fill="rgba(0,115,150,0.55)" />
      <circle cx="452" cy="150" r="24" fill="rgba(0,115,150,0.18)" />

      {/* Tarjetas laterales */}
      <rect x="500" y="84" width="240" height="70" rx="12" fill="rgba(255,255,255,0.05)" />
      <rect x="522" y="106" width="140" height="9" rx="4.5" fill="rgba(255,255,255,0.12)" />
      <rect x="522" y="124" width="100" height="7" rx="3.5" fill="rgba(255,255,255,0.07)" />

      <rect x="500" y="164" width="240" height="70" rx="12" fill="rgba(255,255,255,0.05)" />
      <rect x="522" y="186" width="120" height="9" rx="4.5" fill="rgba(255,255,255,0.12)" />
      <rect x="522" y="204" width="100" height="7" rx="3.5" fill="rgba(255,255,255,0.07)" />

      {/* Gráfico de barras */}
      <rect x="192" y="252" width="548" height="162" rx="14" fill="rgba(255,255,255,0.04)" />
      <rect x="216" y="276" width="110" height="12" rx="6" fill="rgba(255,255,255,0.14)" />
      <rect x="212" y="392" width="548" height="1" fill="rgba(255,255,255,0.08)" />
      <rect x="220" y="366" width="26" height="26" rx="5" fill="rgba(0,115,150,0.45)" />
      <rect x="258" y="348" width="26" height="44" rx="5" fill="rgba(0,115,150,0.45)" />
      <rect x="296" y="356" width="26" height="36" rx="5" fill="rgba(255,255,255,0.12)" />
      <rect x="334" y="332" width="26" height="60" rx="5" fill="rgba(0,115,150,0.6)" />
      <rect x="372" y="344" width="26" height="48" rx="5" fill="rgba(255,255,255,0.12)" />
      <rect x="410" y="318" width="26" height="74" rx="5" fill="rgba(0,115,150,0.45)" />
      <rect x="448" y="340" width="26" height="52" rx="5" fill="rgba(255,255,255,0.12)" />
      <rect x="486" y="306" width="26" height="86" rx="5" fill="rgba(0,115,150,0.55)" />

      {/* Marca pequeña (monograma del proyecto) */}
      <circle cx="726" cy="424" r="13" fill="rgba(0,115,150,0.4)" />
      <text
        x="726"
        y="429"
        textAnchor="middle"
        fontFamily="var(--font-sans), 'Inter', system-ui, sans-serif"
        fontSize="13"
        fontWeight="700"
        fill="rgba(255,255,255,0.85)"
      >
        {initials}
      </text>
    </svg>
  );
}
