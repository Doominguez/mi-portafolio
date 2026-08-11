import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const proyectos = [
  {
    titulo: "LumenStore — Sistema de Gestión Comercial para Tienda en Línea",
    descripcion: [
      "Resumen: Sistema comercial completo para explorar productos, gestionar carritos de compras, procesar pedidos y administrar el catálogo desde un panel de control.",
      "El problema: Gestión descentralizada de ventas, control manual de inventario y ausencia de métricas de negocio en tiempo real.",
      "La solución: Centralización de inventario, ventas y clientes en una sola plataforma orientada a pequeñas y medianas empresas.",
      "Impacto: Métricas de negocio en tiempo real y presencia digital para pymes.",
    ].join("\n"),
    imagenUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
    // Media de demostración para ver el carrusel y el toggle "Demo en video".
    // Reemplázalas por las capturas y el video reales del proyecto.
    screenshots: [
      "https://picsum.photos/seed/lumen-catalogo/1600/900",
      "https://picsum.photos/seed/lumen-carrito/1600/900",
      "https://picsum.photos/seed/lumen-pedidos/1600/900",
    ],
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    linkDemo: null,
    linkGithub: "https://github.com/doominguez/lumenstore",
    tecnologias: ["Java", "Spring Boot", "Spring Security", "JPA/Hibernate", "MySQL", "Angular", "JWT"],
    funcionalidades: [
      "Autenticación por roles (cliente / admin) con Spring Security y JWT.",
      "Control de stock en tiempo real al confirmar un pedido.",
      "Panel administrativo para gestionar productos, pedidos y usuarios.",
    ],
    destacado: true,
  },
];

async function main() {
  console.log("Limpiando datos anteriores...");
  await prisma.proyecto.deleteMany();

  console.log("Creando proyectos...");
  for (const proyecto of proyectos) {
    await prisma.proyecto.create({ data: proyecto });
  }

  console.log(`${proyectos.length} proyecto(s) creado(s) correctamente.`);
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
