import { prisma } from "./prisma";

export type Skill = {
  id: string;
  nombre: string;
  categoria: string;
  logoUrl: string;
  orden: number;
};

export async function getSkills() {
  return prisma.skill.findMany({
    orderBy: [{ orden: "asc" }, { createdAt: "asc" }],
  });
}

export async function getSkillById(id: string) {
  return prisma.skill.findUnique({
    where: { id },
  });
}
