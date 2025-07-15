import { db } from "../db.js";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config.js";
import { randomUUID } from "node:crypto";

import { createAccessToken } from "../libs/jwt.js";

export class UserModel {
  static find = async (id) => {
    const user = await db.execute(`SELECT * FROM users WHERE id = ?`, [id]);
    return user.rows[0];
  };

  static register = async (data) => {
    const { name, email, phone, username, password } = data;
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Validamos si existe el usuario

    const user = await db.execute(
      `SELECT * FROM users WHERE username = ? OR email = ? OR phone = ?`,
      [username, email, phone]
    );

    if (user.rows.length > 0) {
      throw new Error("Username, email o teléfono ya registrados.");
    }

    try {
      await db.execute(
        `INSERT INTO users (id, name, email, phone, username, password_hash, last_login) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [id, name, email, phone, username, hashedPassword]
      );
    } catch (e) {
      throw new Error(`Error al registrar el usuario: ${e.message}`);
    }

    const token = createAccessToken({ id });

    return token;
  };

  static login = async (data) => {
    const { username, password } = data;

    const user = await db.execute(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);

    if (user.rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const { id } = user.rows[0];

    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta");
    }

    try {
      await db.execute({
        sql: `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?`,
        args: [id],
      });
    } catch (error) {
      throw new Error("Ha ocurrido un error");
    }

    const token = createAccessToken({ id });
    return token;
  };
}
