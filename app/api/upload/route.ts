import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const ALLOWED_FORMATS = ["jpg", "png", "webp", "gif", "avif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Tipo de archivo no permitido" },
      { status: 400 }
    );
  }

  if (file.size === 0 || file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "El archivo debe pesar hasta 5 MB" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "portafolio", allowed_formats: ALLOWED_FORMATS },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string });
        }
      )
      .end(buffer);
  });

  return NextResponse.json({ url: result.secure_url });
}
