import { NextResponse } from "next/server";
import { getAddress } from "@chopinframework/next";

async function withTimeout<T>(p: Promise<T>, ms = 8000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("Timeout")), ms);
    p.then((v) => {
      clearTimeout(id);
      resolve(v);
    }).catch((e) => {
      clearTimeout(id);
      reject(e);
    });
  });
}

export async function POST() {
  try {
    const addr = await withTimeout(getAddress(), 8000);
    if (!addr)
      return NextResponse.json(
        { error: "No se obtuvo dirección" },
        { status: 401 }
      );
    return NextResponse.json({ address: addr });
  } catch (e: any) {
    // Fallback opcional para demo en talleres si hay 504/Timeout:
    if (process.env.DEMO_FALLBACK === "1") {
      const demo = "0xDEMO000000000000000000000000000000000001";
      return NextResponse.json({ address: demo, demo: true });
    }
    const msg = e?.message || "Fallo de autenticación";
    const status = msg === "Timeout" ? 504 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
