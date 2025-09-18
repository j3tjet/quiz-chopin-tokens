// seed.ts
import { initDB } from "./src/lib/db";  // ajusta la ruta si es distinta

async function main() {
  const db = await initDB();

  // Crear un token
  await db.run(
    `INSERT INTO tokens (name, symbol, decimals, max_supply)
     VALUES (?, ?, ?, ?)`,
    ["QuizToken", "QUIZ", 0, 1000000]
  );


  console.log("✅ Token creado.");
  await db.close();
}

main().catch((err) => {
  console.error("❌ Error al sembrar la base:", err);
});
