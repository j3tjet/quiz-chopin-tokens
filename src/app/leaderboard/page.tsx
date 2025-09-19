"use client";
import { useEffect, useState } from "react";

type Row = { player: string; score: number };

enum State {
  Idle,
  Loading,
  Error,
  Ready,
}

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [state, setState] = useState<State>(State.Idle);
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimMsg, setClaimMsg] = useState<string | null>(null);

  useEffect(() => {
    setState(State.Loading);
    fetch("/api/quiz/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        setRows(d.leaderboard || []);
        setState(State.Ready);
      })
      .catch(() => setState(State.Error));
  }, []);

  async function handleClaim() {
    setClaimMsg(null);
    setClaiming(true);
    try {
      const res = await fetch("/api/token/mint", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al reclamar");
      setClaimMsg(` Reclamaste ${data.minted} tokens.`);
      setClaimed(true);
    } catch (e: any) {
      setClaimMsg(` ${e.message}`);
      if (e.message.includes("Ya reclamaste")) {
        setClaimed(true);
      }
    } finally {
      setClaiming(false);
    }
  }
  

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Leaderboard</h1>
        <button onClick={handleClaim} disabled={claiming || claimed}
          className={`px-4 py-2 rounded font-semibold text-white transition-colors ${
            claimed
              ? "bg-gray-400 cursor-not-allowed"
              : claiming
              ? "bg-blue-500 cursor-wait"
              : "bg-green-600 hover:bg-green-700"
          }`}
          >
          {claimed ? "Ya reclamado" : claiming ? "Reclamando…" : "Reclamar tokens"}
        </button>
      </div>
      {state === State.Loading && <p>Cargando…</p>}
      {state === State.Error && <p>Error al cargar leaderboard.</p>}
      {state === State.Ready && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                #
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Jugador
              </th>
              <th
                style={{
                  textAlign: "right",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Puntos
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.player}>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {i + 1}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  <code>{r.player}</code>
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: 8,
                    textAlign: "right",
                  }}
                >
                  {r.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <a href="/quiz">← Volver al quiz</a>
      </div>
    </div>
  );
}
