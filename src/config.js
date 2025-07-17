import dotenv from "dotenv";
dotenv.config();

export const { PORT = 3000, SALT_ROUNDS = 10, SECRET_KEY } = process.env;

export const ALLOWED_ORIGINS = [
  "http://localhost:5173", // Frontend de desarrollo
  "https://proyecto-estructuras-topaz.vercel.app/",
];
