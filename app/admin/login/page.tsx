"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError("Email o contraseña incorrectos");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
            <Lock className="h-5 w-5" />
          </span>
          <div>
            <h1 className="heading-lg">Panel Admin</h1>
            <p className="mt-1 text-sm text-[var(--text-2)]">
              Iniciá sesión para gestionar tus proyectos
            </p>
          </div>
        </div>

        {error && (
          <p className="mb-5 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
            className="input-field"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            autoComplete="current-password"
            className="input-field"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Entrando..." : "Iniciar sesión"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
