// /api/balance
import { getBalance } from "@/lib/token";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const tokenId = searchParams.get("token_id") || "1"; // por defecto 1
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  const balance = await getBalance(address, parseInt(tokenId, 10));
  return NextResponse.json({ address, tokenId, balance });
}
