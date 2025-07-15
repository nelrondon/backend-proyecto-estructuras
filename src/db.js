import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

export const db = createClient({
  url: "libsql://estructuradb-nelrondon.aws-us-east-1.turso.io",
  authToken: process.env.DB_TOKEN,
});

// await db.execute(`CREATE TABLE IF NOT EXISTS users (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   name VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL UNIQUE,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// )`);

// await db.execute(`INSERT INTO users (name, email) VALUES
//   ('Nel Rondon', 'nelucho.nel@gmail.com')
//   `);
