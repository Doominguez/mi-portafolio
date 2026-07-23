import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const proyectos = [
  {
    titulo: "LumenStore",
    descripcion:
      "Plataforma de e-commerce full-stack construida con Spring Boot y Angular. API REST con mas de 70 endpoints organizados en modulos de autenticacion, catalogo, ventas y administracion. Implementa JWT con refresh tokens, roles de usuario (ADMIN/USER) y arquitectura en capas (Controller, Service, Repository) con JPA/Hibernate y MySQL. El frontend en Angular ofrece una tienda completa con carrito de compras y panel de administracion.",
    imagenUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
    linkDemo: null,
    linkGithub: "https://github.com/doominguez/lumenstore",
    tecnologias: ["Java", "Spring Boot", "Spring Security", "JPA/Hibernate", "MySQL", "Angular", "JWT"],
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
