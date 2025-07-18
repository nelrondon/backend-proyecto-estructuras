import { validateUser, validatePartialUser } from "../schemas/user.schema.js";
import { UserModel } from "../models/auth.model.js";

import { createAccessToken } from "../libs/jwt.js";

export class AuthController {
  static async get(req, res) {
    const { id } = req.user;
    const userFound = await UserModel.find(id);

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
      phone: userFound.phone,
      role: userFound.role,
      username: userFound.username,
      last_login: userFound.last_login,
    });
  }

  static async login(req, res) {
    const { username, password } = req.body;

    const result = validatePartialUser(req.body);

    if (!result.success) {
      const [message] = JSON.parse(result.error);
      return res.status(422).json({ error: message.message });
    }

    try {
      const token = await UserModel.login({ username, password });
      res.cookie("token", token);
      res.status(200).json({ message: "Usuario Loggeado" });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async register(req, res) {
    const { name, email, phone, username, password } = req.body;

    const result = validateUser(req.body);

    if (!result.success) {
      const [message] = JSON.parse(result.error);
      return res.status(422).json({ error: message.message });
    }

    try {
      const user = await UserModel.register(req.body);
      const token = await createAccessToken({ id: user.id });
      res.cookie("token", token);
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        last_login: user.last_login,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  static logout(req, res) {
    res.cookie("token", "", { expires: new Date(0) });
    res.status(200).json({ message: "Usuario deslogueado" });
  }
}
