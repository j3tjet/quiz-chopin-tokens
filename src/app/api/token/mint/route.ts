import { NextResponse } from "next/server";
import { mint } from "@/lib/token";
import { getAddress } from "@chopinframework/next";
import { dbGetResponses } from "@/lib/responses";
import { getBalance } from "@/lib/token";

const TOKEN_ID = 1; 
const TOKENS_PER_CORRECT = 10; 

export async function POST() {
  try {
    const address = await getAddress(); 
    if (!address) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const allResponses = await dbGetResponses();
    const correct = allResponses.filter((r) => r.player === address && r.isCorrect);

    

    if (correct.length === 0) {
      return NextResponse.json({ error: "No tienes respuestas correctas" }, { status: 400 });
    }
    const balance = await getBalance(address, TOKEN_ID);
    const amount = correct.length * TOKENS_PER_CORRECT - balance;
    if(amount > 0) {

        await mint(address, amount, TOKEN_ID);
    }

    return NextResponse.json({
      ok: true,
      minted: amount,
      address,
      token_id: TOKEN_ID,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error al reclamar" }, { status: 500 });
  }
}
