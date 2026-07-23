import { prisma } from "./prisma";

export async function getProyectos() {
  return prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getProyectoById(id: string) {
  return prisma.proyecto.findUnique({
    where: { id },
  });
}

export async function getProyectosDestacados() {
  return prisma.proyecto.findMany({
    where: { destacado: true },
    orderBy: { createdAt: "desc" },
  });
}
