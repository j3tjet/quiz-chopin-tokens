import { NextResponse } from "next/server";

export async function POST() {
  // Mantendremos el ORDEN FIJO de QUESTIONS.
  // Devolvemos un "seed" fijo solo para transparencia/consistencia en la UI.
  const seed = "fixed-seed-v1";
  return NextResponse.json({ seed });
}
