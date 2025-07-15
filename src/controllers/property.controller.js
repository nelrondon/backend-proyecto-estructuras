import {
  validateProperty,
  validatePartialProperty,
} from "../schemas/property.schema.js";

import { PropiertyModel } from "../models/property.model.js";

import { capitalize } from "../libs/utils.js";

export class PropertyController {
  static async get(req, res) {
    const propierties = await PropiertyModel.getAll();
    res.json(propierties);
  }
  static async getByID(req, res) {
    const { id } = req.params;
    const property = await PropiertyModel.getById(id);

    try {
      res.status(200).json({ property });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getByType(req, res) {
    const { type } = req.params;
    const newType = capitalize(type);

    const result = validatePartialProperty({ type: newType });
    if (!result.success) {
      const [message] = JSON.parse(result.error.message);
      return res.status(422).json({ error: message.message });
    }

    try {
      const properties = await PropiertyModel.getByType(newType);
      res.status(200).json({ properties });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getByStatus(req, res) {
    const { status } = req.params;
    const newStatus = capitalize(status);

    const result = validatePartialProperty({ status: newStatus });

    if (!result.success) {
      const [message] = JSON.parse(result.error.message);
      return res.status(422).json({ error: message.message });
    }

    try {
      const propierties = await PropiertyModel.getByStatus(newStatus);
      res.status(200).json({ propierties });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async register(req, res) {
    const result = validateProperty(req.body);

    if (!result.success) {
      const [message] = JSON.parse(result.error.message);
      return res.status(422).json({ error: message.message });
    }

    const data = {
      ...req.body,
      userId: req.user.id,
    };

    try {
      const result = await PropiertyModel.register(data);
      console.log(result);
      res.json({ message: "Datos Recibidos" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static modify(req, res) {}
  static delete(req, res) {}
}
