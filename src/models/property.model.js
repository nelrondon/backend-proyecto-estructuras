import { type } from "node:os";
import { db } from "../db.js";
import { randomUUID } from "node:crypto";

export class PropiertyModel {
  static async getAll() {
    try {
      const propierties = await db.execute(`SELECT * FROM properties`);
      if (propierties.rows.length === 0) {
        throw new Error("No hay propiedades");
      }

      return propierties.rows;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  static async getById(id) {
    try {
      const propierties = await db.execute(
        `SELECT * FROM properties WHERE id = ?`,
        [id]
      );
      if (propierties.rows.length === 0) {
        throw new Error("Propiedad no encontrada en la base de datos");
      }

      return propierties.rows[0];
    } catch (e) {
      throw new Error(e.message);
    }
  }

  static async getByStatus(status) {
    try {
      const propierties = await db.execute(
        `SELECT * FROM properties WHERE status = ?`,
        [status]
      );
      if (propierties.rows.length === 0) {
        throw new Error("No existen propiedades con este Estado");
      }

      return propierties.rows;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  static async getByType(type) {
    try {
      const propierties = await db.execute(
        `SELECT * FROM properties WHERE property_type = ?`,
        [type]
      );
      if (propierties.rows.length === 0) {
        throw new Error("No hay propiedades de este tipo");
      }

      return propierties.rows;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  static async register(data) {
    const id = randomUUID();
    const {
      title,
      description,
      status,
      property_type,
      address,
      city,
      state,
      zip_code,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      userId,
    } = data;

    try {
      await db.execute(
        `INSERT INTO properties (id, address, city, state, zip_code, price, bedrooms, bathrooms, square_feet, status, title, description, property_type, user_id)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          address,
          city,
          state,
          zip_code,
          price,
          bedrooms,
          bathrooms,
          square_feet,
          status,
          title,
          description,
          property_type,
          userId,
        ]
      );
      return true;
    } catch (e) {
      throw new Error(`Error al registrar la Propiedad: ${e.message}`);
    }
  }
}
