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

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: 16 }}>
      <h1>Leaderboard</h1>
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
