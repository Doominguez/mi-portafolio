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
  const funcionalidadesRaw = (formData.get("funcionalidades") as string) || null;
  const desafios = (formData.get("desafios") as string) || null;
  const aprendizajes = (formData.get("aprendizajes") as string) || null;

  const tecnologias = parseArrayField(tecnologiasRaw);
  const screenshots = parseArrayField(screenshotsRaw);
  const funcionalidades = funcionalidadesRaw
    ? funcionalidadesRaw.split("\n").map((f) => f.trim()).filter(Boolean)
    : [];

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

export async function editarProyecto(idOrFormData: string | FormData, maybeFormData?: FormData) {
  const id = typeof idOrFormData === "string" ? idOrFormData : (idOrFormData.get("proyectoId") as string);
  const formData = typeof idOrFormData === "string" ? maybeFormData! : idOrFormData;
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
  const funcionalidadesRaw = (formData.get("funcionalidades") as string) || null;
  const desafios = (formData.get("desafios") as string) || null;
  const aprendizajes = (formData.get("aprendizajes") as string) || null;

  const tecnologias = parseArrayField(tecnologiasRaw);
  const screenshots = parseArrayField(screenshotsRaw);
  const funcionalidades = funcionalidadesRaw
    ? funcionalidadesRaw.split("\n").map((f) => f.trim()).filter(Boolean)
    : [];

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
