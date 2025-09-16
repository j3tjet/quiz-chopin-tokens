import { NextResponse } from "next/server";
import { Oracle, getAddress } from "@chopinframework/next";
import { randomUUID } from "crypto";
import { QUESTIONS } from "@/lib/questions";
import AuthButton from "@/components/AuthButton";
import { dbAddResponse, dbFindResponse, ResponseRec } from "@/lib/db";

export async function POST(req: Request) {
  const { questionId, choiceIndex } = await req.json();

  // Identidad del jugador (wallet). Si no hay, bloquea.
  let player: string | null = null;
  try {
    player = await getAddress();
  } catch {
    // Si no hay wallet integrada/activa, devuelve 401 para el taller.
  }
  if (!player) {
    return NextResponse.json(
      { error: "No se detectó sesión. Conéctate/inicia sesión para jugar." },
      { status: 401 }
    );
  }

  const q = QUESTIONS.find((x) => x.id === String(questionId));
  if (!q)
    return NextResponse.json(
      { error: "Pregunta inexistente" },
      { status: 400 }
    );

  // Anti-doble envío por jugador/pregunta
  const exists = dbFindResponse(player, q.id);
  if (exists)
    return NextResponse.json({ error: "Ya respondiste" }, { status: 409 });

  // Tiempo verificable
  const now = await Oracle.now();

  // Notarización de la acción (registro de respuesta)
  const payload = {
    type: "QUIZ_ANSWER",
    player,
    questionId: q.id,
    choiceIndex: Number(choiceIndex),
    verifiedAt: now,
  };
  const proof = await Oracle.notarize(() => payload);

  const isCorrect = Number(choiceIndex) === q.correctIndex;
  const rec: ResponseRec = {
    id: randomUUID(),
    player,
    questionId: q.id,
    choiceIndex: Number(choiceIndex),
    isCorrect,
    verifiedAt: now,
    proofId: String((proof as any)?.id ?? proof),
  };

  dbAddResponse(rec);
  return NextResponse.json(rec);
}
