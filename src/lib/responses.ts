import { initDB } from "./db";

export type ResponseRec = {
  id: string;
  player: string;
  questionId: string;
  choiceIndex: number;
  isCorrect: boolean;
  verifiedAt: number; // epoch ms
  proofId: string;
};

// Insertar una respuesta
export async function dbAddResponse(r: ResponseRec) {
  const db = await initDB();
  await db.run(
    `INSERT INTO responses (id, player, questionId, choiceIndex, isCorrect, verifiedAt, proofId)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      r.id,
      r.player,
      r.questionId,
      r.choiceIndex,
      r.isCorrect ? 1 : 0,
      r.verifiedAt,
      r.proofId,
    ]
  );
}

// Buscar respuesta de un jugador a una pregunta
export async function dbFindResponse(player: string, questionId: string): Promise<ResponseRec | null> {
  const db = await initDB();
  const row = await db.get(
    `SELECT * FROM responses WHERE player = ? AND questionId = ? LIMIT 1`,
    [player, questionId]
  );
  if (!row) return null;

  return {
    ...row,
    isCorrect: row.isCorrect === 1, // convertir de INTEGER → boolean
  };
}

// Obtener todas las respuestas
export async function dbGetResponses(): Promise<ResponseRec[]> {
  const db = await initDB();
  const rows = await db.all(`SELECT * FROM responses ORDER BY verifiedAt DESC`);

  return rows.map((row) => ({
    ...row,
    isCorrect: row.isCorrect === 1,
  }));
}
