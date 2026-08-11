interface SimpleIconProps {
  slug: string;
  className?: string;
  label?: string;
}

// Renderiza logos de marcas/tecnologías desde Simple Icons
// (https://simpleicons.org) usando la CDN cdn.simpleicons.org.
//
// La técnica de mask-image hace que el icono herede el color del texto
// (currentColor), por lo que funciona igual que un icono de lucide-react:
// se puede colorear con clases de Tailwind como `text-[var(--accent)]`,
// incluyendo estados hover.
//
// Importante: Simple Icons solo contiene logos de marcas. Para iconos
// genéricos de interfaz (flechas, chevrones, cerrar, menú, etc.) usar
// lucide-react.
export default function SimpleIcon({
  slug,
  className = "",
  label,
}: SimpleIconProps) {
  const url = `https://cdn.simpleicons.org/${slug}`;
  return (
    <span
      role={label ? "img" : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className}
      style={{
        display: "inline-block",
        backgroundColor: "currentColor",
        WebkitMaskImage: `url("${url}")`,
        maskImage: `url("${url}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
