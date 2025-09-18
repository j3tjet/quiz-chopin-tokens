import { NextResponse } from "next/server";
import { dbGetResponses } from "@/lib/responses";

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const responses = await dbGetResponses();
  const resp = responses.find((r) => r.id === ctx.params.id);
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
