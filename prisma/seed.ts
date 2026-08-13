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
    tecnologias: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "JPA/Hibernate",
      "MySQL",
      "Angular",
      "JWT",
    ],
    funcionalidades: [
      "Autenticación por roles (cliente / admin) con Spring Security y JWT.",
      "Control de stock en tiempo real al confirmar un pedido.",
      "Panel administrativo para gestionar productos, pedidos y usuarios.",
    ],
    destacado: true,
  },
];

const skills = [
  {
    nombre: "Java 21",
    categoria: "Backend",
    logoUrl: "https://cdn.simpleicons.org/java",
    orden: 0,
  },
  {
    nombre: "Spring Boot 3.5",
    categoria: "Backend",
    logoUrl: "https://cdn.simpleicons.org/springboot",
    orden: 1,
  },
  {
    nombre: "Spring Cloud 2025",
    categoria: "Backend",
    logoUrl: "https://cdn.simpleicons.org/spring",
    orden: 2,
  },
  // Reutilizamos el logo de Spring para las piezas del ecosistema Spring
  {
    nombre: "Eureka Discovery",
    categoria: "Backend",
    logoUrl: "https://cdn.simpleicons.org/spring",
    orden: 3,
  },
  {
    nombre: "Config Server",
    categoria: "Backend",
    logoUrl: "https://cdn.simpleicons.org/spring",
    orden: 4,
  },
  {
    nombre: "Spring Security",
    categoria: "Backend",
    logoUrl: "https://cdn.simpleicons.org/spring",
    orden: 7,
  },
  {
    nombre: "Spring Data JPA",
    categoria: "Backend",
    logoUrl: "https://cdn.simpleicons.org/spring",
    orden: 5,
  },
  {
    nombre: "Maven",
    categoria: "Herramientas",
    logoUrl: "https://cdn.simpleicons.org/apachemaven",
    orden: 10,
  },
  {
    nombre: "REST API",
    categoria: "Backend",
    // Se omite logo específico: REST es implícito; no crear registro aquí si no se necesita
    logoUrl: "https://cdn.simpleicons.org/http",
    orden: 6,
  },
  {
    nombre: "Angular 21",
    categoria: "Frontend",
    logoUrl: "https://cdn.simpleicons.org/angular",
    orden: 12,
  },
  {
    nombre: "Bootstrap 5",
    categoria: "Frontend",
    logoUrl: "https://cdn.simpleicons.org/bootstrap",
    orden: 13,
  },
  {
    nombre: "TypeScript",
    categoria: "Frontend",
    logoUrl: "https://cdn.simpleicons.org/typescript",
    orden: 14,
  },
  {
    nombre: "RabbitMQ",
    categoria: "Backend",
    logoUrl: "https://cdn.simpleicons.org/rabbitmq",
    orden: 15,
  },
  {
    nombre: "WebSockets",
    categoria: "Backend",
    // Usar icono genérico de websockets (si disponible) o HTTP como fallback
    logoUrl: "https://cdn.simpleicons.org/socketdotio",
    orden: 11,
  },
  {
    nombre: "Docker / Docker Compose",
    categoria: "Herramientas",
    logoUrl: "https://cdn.simpleicons.org/docker",
    orden: 17,
  },
  // Las entradas de base de datos se crean según el entorno (DATABASE_URL)
  {
    nombre: "HTML / CSS / SCSS",
    categoria: "Frontend",
    logoUrl: "https://cdn.simpleicons.org/html5",
    orden: 20,
  },
];

async function main() {
  console.log("Limpiando datos anteriores...");
  await prisma.proyecto.deleteMany();

  // Limpiar y crear logos de habilidades
  console.log("Actualizando habilidades técnicas...");
  await prisma.skill.deleteMany();

  console.log("Creando proyectos...");
  for (const proyecto of proyectos) {
    await prisma.proyecto.create({ data: proyecto });
  }

  // Determinar la base de datos del entorno y añadir solo la correspondiente
  const dbUrl = process.env.DATABASE_URL || "";
  const dbSkills: typeof skills = [] as any;
  if (dbUrl.includes("postgres") || dbUrl.includes("postgresql")) {
    dbSkills.push({
      nombre: "PostgreSQL",
      categoria: "Base de datos",
      logoUrl: "https://cdn.simpleicons.org/postgresql",
      orden: 99,
    });
  } else if (dbUrl.includes("mysql") || dbUrl.includes("mariadb")) {
    dbSkills.push({
      nombre: "MySQL",
      categoria: "Base de datos",
      logoUrl: "https://cdn.simpleicons.org/mysql",
      orden: 99,
    });
  }

  const finalSkills = [...skills, ...dbSkills];

  console.log("Creando skills...");
  for (const skill of finalSkills) {
    await prisma.skill.create({ data: skill });
  }

  console.log(`${proyectos.length} proyecto(s) creado(s) correctamente.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
