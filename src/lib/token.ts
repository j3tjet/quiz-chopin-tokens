import { initDB } from "./db";

// Crear un token
export async function createToken(
  name: string,
  symbol: string,
  decimals: number,
  max_supply: number
) {
  const db = await initDB();
  await db.run(
    `INSERT INTO tokens (name, symbol, decimals, max_supply) VALUES (?, ?, ?, ?)`,
    [name, symbol, decimals, max_supply]
  );
}

// Obtener supply máximo
export async function getMaxSupply(token_id: number) {
  const db = await initDB();
  const row = await db.get(`SELECT max_supply FROM tokens WHERE id = ?`, [
    token_id,
  ]);
  return row ? row.max_supply : 0;
}

// Supply circulante
export async function getTotalCirculatingSupply(token_id: number) {
  const db = await initDB();
  const row = await db.get(
    `SELECT SUM(balance) as total FROM balances WHERE token_id = ?`,
    [token_id]
  );
  return row?.total || 0;
}

// Balance de un usuario
export async function getBalance(address: string, token_id: number) {
  const db = await initDB();
  const row = await db.get(
    `SELECT balance FROM balances WHERE address = ? AND token_id = ?`,
    [address, token_id]
  );
  return row ? row.balance : 0;
}

// Mint
export async function mint(address: string, amount: number, token_id: number) {
  const maxSupply = await getMaxSupply(token_id);
  const currentSupply = await getTotalCirculatingSupply(token_id);

  if (currentSupply + amount > maxSupply) {
    throw new Error("Minting would exceed max supply");
  }

  const db = await initDB();
  await db.run(
    `INSERT INTO balances (address, token_id, balance)
     VALUES (?, ?, ?)
     ON CONFLICT(address, token_id)
     DO UPDATE SET balance = balance + ?`,
    [address, token_id, amount, amount]
  );
}

// Burn
export async function burn(address: string, amount: number, token_id: number) {
  const balance = await getBalance(address, token_id);
  if (balance < amount) {
    throw new Error("Insufficient balance");
  }

  const db = await initDB();
  await db.run(
    `UPDATE balances SET balance = balance - ? WHERE address = ? AND token_id = ?`,
    [amount, address, token_id]
  );
}

// Transfer
export async function transfer(
  from: string,
  to: string,
  amount: number,
  token_id: number
) {
  const senderBalance = await getBalance(from, token_id);
  if (senderBalance < amount) {
    throw new Error("Insufficient balance");
  }

  const db = await initDB();
  await db.run(
    `UPDATE balances SET balance = balance - ? WHERE address = ? AND token_id = ?`,
    [amount, from, token_id]
  );

  await db.run(
    `INSERT INTO balances (address, token_id, balance)
     VALUES (?, ?, ?)
     ON CONFLICT(address, token_id)
     DO UPDATE SET balance = balance + ?`,
    [to, token_id, amount, amount]
  );
}
