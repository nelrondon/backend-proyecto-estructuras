import { validateUser, validatePartialUser } from "../schemas/user.schema.js";
import { UserModel } from "../models/auth.model.js";

import { createAccessToken, verifyToken } from "../libs/jwt.js";

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
      const user = await UserModel.login({ username, password });
      const token = await createAccessToken({ id: user.id });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(200).json({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        last_login: user.last_login,
      });
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
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
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

  static async verifyToken(req, res) {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "No hay token en la petición" });
    }

    try {
      const { id } = await verifyToken(token);
      const user = await UserModel.find(id);
      if (!user) {
        return res.status(401).json({ message: "Token inválido" });
      }
      return res.status(200).json({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        last_login: user.last_login,
      });
    } catch (e) {
      return res.status(401).json({ message: "Token inválido" });
    }
  }
}
