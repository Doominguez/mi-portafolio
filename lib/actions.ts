"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
  return session;
}

function parseArrayField(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function requireValidUrl(
  value: string | null | undefined,
  label: string,
): void {
  if (!value) return;
  if (!isValidHttpUrl(value)) {
    throw new Error(`La URL de ${label} es inválida`);
  }
}

function validateProyectoFields(input: {
  imagenUrl: string;
  linkDemo: string | null;
  linkGithub: string | null;
  videoUrl: string | null;
  screenshots: string[];
}): void {
  // La imagen principal es opcional: si viene vacía se muestra el
  // placeholder generativo en la card y el modal.
  if (input.imagenUrl && !isValidHttpUrl(input.imagenUrl)) {
    throw new Error("La URL de imagen es inválida");
  }
  requireValidUrl(input.linkDemo, "la demo");
  requireValidUrl(input.linkGithub, "GitHub");
  requireValidUrl(input.videoUrl, "el video");
  for (const shot of input.screenshots) {
    requireValidUrl(shot, "un screenshot");
  }
}

export async function crearProyecto(formData: FormData) {
  await requireAdmin();

  const titulo = formData.get("titulo") as string;
  const descripcion = formData.get("descripcion") as string;
  const imagenUrl = formData.get("imagenUrl") as string;
  const linkDemo = (formData.get("linkDemo") as string) || null;
  const linkGithub = (formData.get("linkGithub") as string) || null;
  const tecnologiasRaw = formData.get("tecnologias") as string;
  const destacado = formData.get("destacado") === "on";
  const videoUrl = (formData.get("videoUrl") as string) || null;
  const screenshotsRaw = (formData.get("screenshots") as string) || null;
  const funcionalidadesRaw =
    (formData.get("funcionalidades") as string) || null;
  const desafios = (formData.get("desafios") as string) || null;
  const aprendizajes = (formData.get("aprendizajes") as string) || null;

  const tecnologias = parseArrayField(tecnologiasRaw);
  const screenshots = parseArrayField(screenshotsRaw);
  const funcionalidades = funcionalidadesRaw
    ? funcionalidadesRaw
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  validateProyectoFields({
    imagenUrl,
    linkDemo,
    linkGithub,
    videoUrl,
    screenshots,
  });

  await prisma.proyecto.create({
    data: {
      titulo,
      descripcion,
      imagenUrl,
      linkDemo,
      linkGithub,
      tecnologias,
      destacado,
      videoUrl,
      screenshots,
      funcionalidades,
      desafios,
      aprendizajes,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function editarProyecto(
  idOrFormData: string | FormData,
  maybeFormData?: FormData,
) {
  const id =
    typeof idOrFormData === "string"
      ? idOrFormData
      : (idOrFormData.get("proyectoId") as string);
  const formData =
    typeof idOrFormData === "string" ? maybeFormData! : idOrFormData;
  await requireAdmin();

  const titulo = formData.get("titulo") as string;
  const descripcion = formData.get("descripcion") as string;
  const imagenUrl = formData.get("imagenUrl") as string;
  const linkDemo = (formData.get("linkDemo") as string) || null;
  const linkGithub = (formData.get("linkGithub") as string) || null;
  const tecnologiasRaw = formData.get("tecnologias") as string;
  const destacado = formData.get("destacado") === "on";
  const videoUrl = (formData.get("videoUrl") as string) || null;
  const screenshotsRaw = (formData.get("screenshots") as string) || null;
  const funcionalidadesRaw =
    (formData.get("funcionalidades") as string) || null;
  const desafios = (formData.get("desafios") as string) || null;
  const aprendizajes = (formData.get("aprendizajes") as string) || null;

  const tecnologias = parseArrayField(tecnologiasRaw);
  const screenshots = parseArrayField(screenshotsRaw);
  const funcionalidades = funcionalidadesRaw
    ? funcionalidadesRaw
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  validateProyectoFields({
    imagenUrl,
    linkDemo,
    linkGithub,
    videoUrl,
    screenshots,
  });

  await prisma.proyecto.update({
    where: { id },
    data: {
      titulo,
      descripcion,
      imagenUrl,
      linkDemo,
      linkGithub,
      tecnologias,
      destacado,
      videoUrl,
      screenshots,
      funcionalidades,
      desafios,
      aprendizajes,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function eliminarProyecto(id: string) {
  await requireAdmin();

  await prisma.proyecto.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin");
}

function parseInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function validateSkillFields(input: {
  nombre: string;
  logoUrl: string;
  categoria: string;
  orden: number;
}) {
  if (!input.nombre.trim()) {
    throw new Error("El nombre de la habilidad es obligatorio");
  }
  if (!isValidHttpUrl(input.logoUrl)) {
    throw new Error("La URL del logo es inválida");
  }
  const categories = ["Frontend", "Backend", "Herramientas", "Base de datos"];
  if (!categories.includes(input.categoria)) {
    throw new Error("La categoría de la habilidad no es válida");
  }
  if (input.orden < 0) {
    throw new Error("El orden debe ser un número positivo");
  }
}

export async function crearSkill(formData: FormData) {
  await requireAdmin();

  const nombre = (formData.get("nombre") as string) || "";
  const categoria = (formData.get("categoria") as string) || "Frontend";
  const logoUrl = (formData.get("logoUrl") as string) || "";
  const orden = parseInteger(formData.get("orden") as string | null, 0);

  validateSkillFields({ nombre, logoUrl, categoria, orden });

  await prisma.skill.create({
    data: {
      nombre,
      categoria,
      logoUrl,
      orden,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/habilidades");
  redirect("/admin/habilidades");
}

export async function editarSkill(
  idOrFormData: string | FormData,
  maybeFormData?: FormData,
) {
  const id =
    typeof idOrFormData === "string"
      ? idOrFormData
      : (idOrFormData.get("skillId") as string);
  const formData =
    typeof idOrFormData === "string" ? maybeFormData! : idOrFormData;

  await requireAdmin();

  const nombre = (formData.get("nombre") as string) || "";
  const categoria = (formData.get("categoria") as string) || "Frontend";
  const logoUrl = (formData.get("logoUrl") as string) || "";
  const orden = parseInteger(formData.get("orden") as string | null, 0);

  validateSkillFields({ nombre, logoUrl, categoria, orden });

  await prisma.skill.update({
    where: { id },
    data: {
      nombre,
      categoria,
      logoUrl,
      orden,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/habilidades");
  redirect("/admin/habilidades");
}

export async function eliminarSkill(id: string) {
  await requireAdmin();

  await prisma.skill.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/habilidades");
}
