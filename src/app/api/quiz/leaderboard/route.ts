import { NextResponse } from "next/server";
import { dbGetResponses } from "@/lib/db";
import { QUESTIONS } from "@/lib/questions";

type ScoreMap = Record<string, number>;

export async function GET() {
  const responses = dbGetResponses();
  const scores: ScoreMap = {};

  // 10 pts por acierto
  for (const r of responses) {
    if (r.isCorrect) scores[r.player] = (scores[r.player] ?? 0) + 10;
  }

  // Bonus por rapidez por pregunta: +5, +3, +1
  for (const q of QUESTIONS) {
    const corrects = responses
      .filter((r) => r.questionId === q.id && r.isCorrect)
      .sort((a, b) => a.verifiedAt - b.verifiedAt);

    if (corrects[0])
      scores[corrects[0].player] = (scores[corrects[0].player] ?? 0) + 5;
    if (corrects[1])
      scores[corrects[1].player] = (scores[corrects[1].player] ?? 0) + 3;
    if (corrects[2])
      scores[corrects[2].player] = (scores[corrects[2].player] ?? 0) + 1;
  }

  const leaderboard = Object.entries(scores)
    .map(([player, score]) => ({ player, score }))
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({ leaderboard });
}
