import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

let db: Database | null = null;

export async function initDB() {
  if (db) return db;

  db = await open({
    filename: path.join(process.cwd(), "app.db"),
    driver: sqlite3.Database,
  });

  await db.exec(`PRAGMA foreign_keys = ON;`);
  await db.exec(`PRAGMA journal_mode = WAL;`);

  //Tabla TOKENS
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL,
      decimals INTEGER NOT NULL,
      max_supply INTEGER NOT NULL
    );
  `);

  //Tabla BALANCES
  await db.exec(`
    CREATE TABLE IF NOT EXISTS balances (
      address TEXT NOT NULL,
      token_id INTEGER NOT NULL,
      balance INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (address, token_id),
      FOREIGN KEY (token_id) REFERENCES tokens(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  //Tabla RESPUESTAS
  await db.exec(`
    CREATE TABLE IF NOT EXISTS responses (
      id TEXT PRIMARY KEY,
      player TEXT NOT NULL,
      questionId TEXT NOT NULL,
      choiceIndex INTEGER NOT NULL,
      isCorrect INTEGER NOT NULL,
      verifiedAt INTEGER NOT NULL,
      proofId TEXT NOT NULL
    );
  `);

  await db.exec(`CREATE INDEX IF NOT EXISTS idx_balances_address ON balances(address);`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_responses_player ON responses(player);`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_responses_question ON responses(questionId);`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_responses_verifiedAt ON responses(verifiedAt DESC);`);

  return db;
}
