import { NextResponse } from "next/server";
import { dbGetResponses } from "@/lib/responses";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const responses = await dbGetResponses();
  const resp = responses.find((r) => r.id === id);
  if (!resp)
    return NextResponse.json(
      { error: "No existe la respuesta" },
      { status: 404 }
    );

  return NextResponse.json({
    id: resp.id,
    player: resp.player,
    questionId: resp.questionId,
    choiceIndex: resp.choiceIndex,
    isCorrect: resp.isCorrect,
    verifiedAt: resp.verifiedAt,
    proofId: resp.proofId,
  });
}
