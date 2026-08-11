<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Iconos

- Logos de marcas y tecnologías (GitHub, LinkedIn, Spring Boot, Angular, MySQL, etc.): usar el componente `components/SimpleIcon.tsx` con el slug de [simpleicons.org](https://simpleicons.org) (`<SimpleIcon slug="github" className="h-4 w-4 text-[var(--text-2)]" />`). Hereda `currentColor`, por lo que se colorea con clases de texto de Tailwind (incluye hover).
- Iconos genéricos de interfaz (flechas, chevrones, cerrar, menú, sol/luna, mail, descargar, basura, etc.): lucide-react.
- Notas sobre slugs: Maven → `apachemaven`; JWT → `jsonwebtokens`; LinkedIn no existe en Simple Icons (usar `LinkedinIcon` de `components/SocialIcons.tsx`); Java (logo clásico de la taza de café) no está en Simple Icons — en su lugar solo existe `openjdk`, así que usar `JavaIcon` de `components/SocialIcons.tsx`.
- Verificar que un slug existe probando `https://cdn.simpleicons.org/<slug>` (200 = existe, 404 = no).

