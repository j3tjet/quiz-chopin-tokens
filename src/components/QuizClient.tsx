"use client";
import { useEffect, useState } from "react";
import AuthButton from "@/components/AuthButton";
import { QUESTIONS } from "@/lib/questions";

type Resp = {
  id: string;
  questionId: string;
  choiceIndex: number;
  isCorrect: boolean;
  verifiedAt: number;
  proofId: string;
};

export default function QuizClient() {
  const [seed, setSeed] = useState<string | null>(null);
  const [answered, setAnswered] = useState<Record<string, Resp>>({});
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/quiz/start", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setSeed(d.seed))
      .catch(() => setSeed("fixed-seed-v1"));
  }, []);

  async function answer(qid: string, idx: number) {
    setError(null);
    if (!address) {
      setError("Primero conecta tu wallet (embebida).");
      return;
    }
    try {
      const res = await fetch("/api/quiz/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: qid, choiceIndex: idx }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Error inesperado");
        return;
      }
      setAnswered((prev) => ({ ...prev, [qid]: data }));
    } catch (e: any) {
      setError(e?.message || "Fallo de red");
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <h1>Quiz relámpago (verificable)</h1>
      <p style={{ opacity: 0.8 }}>
        Seed: <code>{seed}</code> · Orden fijo para todos
      </p>

      <AuthButton onAuth={(addr) => setAddress(addr)} />

      {error && (
        <div
          style={{
            background: "#fee",
            border: "1px solid #fbb",
            padding: 8,
            marginBottom: 12,
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {QUESTIONS.map((q, qi) => {
        const r = answered[q.id];
        return (
          <div
            key={q.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              {qi + 1}. {q.prompt}
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {q.options.map((op, idx) => {
                const disabled = !!r || !address; // requiere login o ya respondió
                const chosen = r?.choiceIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => answer(q.id, idx)}
                    disabled={disabled}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #ccc",
                      cursor: disabled ? "not-allowed" : "pointer",
                      background: chosen ? "#eef" : "#fff",
                    }}
                  >
                    {op}
                  </button>
                );
              })}
            </div>

            {r && (
              <div style={{ marginTop: 10, fontSize: 14 }}>
                {r.isCorrect ? "✅ Correcto" : "❌ Incorrecto"} · Tiempo
                (verificable):{" "}
                <code>{new Date(r.verifiedAt).toLocaleString()}</code>
                <div>
                  Prueba:{" "}
                  <a
                    href={`/api/quiz/proof/${r.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ver JSON
                  </a>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <a href="/leaderboard">Ver leaderboard →</a>
      </div>
    </div>
  );
}
