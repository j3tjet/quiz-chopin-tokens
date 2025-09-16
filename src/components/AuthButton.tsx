"use client";
import { useEffect, useMemo, useState } from "react";
import LoginEmbedded from "@/components/LoginEmbedded";

export default function AuthButton({
  onAuth,
}: {
  onAuth: (addr: string) => void;
}) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<null | {
    method: "email" | "wallet";
  }>(null);

  const redirectPath =
    typeof window !== "undefined" ? window.location.pathname : "/quiz";
  // Usa “embed=1” y el método deseado (“email” o “wallet”).
  // Si tu instancia usa otro parámetro (p.ej. provider=…), cámbialo aquí.
  const baseLogin = useMemo(
    () => `/_chopin/login?embed=1&redirect=${encodeURIComponent(redirectPath)}`,
    [redirectPath]
  );

  async function ensureAuth() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/ensure", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo iniciar sesión");
      setAddress(data.address);
      onAuth(data.address);
    } catch (e: any) {
      setError(
        e?.message || "Fallo de autenticación (¿corriendo 'npx chopd'?)"
      );
    } finally {
      setLoading(false);
    }
  }

  // Intenta resolver sesión si ya está logueado
  useEffect(() => {
    ensureAuth().catch(() => {});
  }, []);

  return (
    <div style={{ marginBottom: 12 }}>
      {address ? (
        <div style={{ fontSize: 14 }}>
          Conectado como <code>{address}</code>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setShowModal({ method: "email" })}
            disabled={loading}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          >
            Iniciar con email
          </button>
          <button
            onClick={() => setShowModal({ method: "wallet" })}
            disabled={loading}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          >
            Iniciar con wallet Web3
          </button>
          <button
            onClick={ensureAuth}
            disabled={loading}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          >
            Ya inicié sesión → Detectar address
          </button>
        </div>
      )}

      {error && <div style={{ color: "#b00", marginTop: 6 }}>{error}</div>}

      {showModal && (
        <LoginEmbedded
          // Ajusta “method=” si tu instancia usa otro nombre (p.ej., provider=email / provider=wallet)
          src={`${baseLogin}&method=${showModal.method}`}
          onClose={async () => {
            setShowModal(null);
            await ensureAuth();
          }}
        />
      )}
    </div>
  );
}
