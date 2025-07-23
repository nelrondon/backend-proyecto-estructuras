import { db } from "../db.js";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config.js";
import { randomUUID } from "node:crypto";

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

    const newUser = {
      id,
      ...data,
    };

    return newUser;
  };

  static login = async (data) => {
    const { username, password } = data;
    const last_login = new Date();

    const user = await db.execute(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);

    if (user.rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const { id, name, email, phone } = user.rows[0];

    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!isPasswordValid) {
      throw new Error("Usuario o Contraseña incorrecta");
    }
    try {
      await db.execute({
        sql: `UPDATE users SET last_login = ? WHERE id = ?`,
        args: [id, last_login],
      });
    } catch (e) {
      console.log(e);
      throw new Error("Error al actualizar el usuario");
    }

    return {
      id,
      name,
      email,
      phone,
      username,
      last_login,
    };
  };
}
