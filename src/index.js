import express from "express";
import { PORT } from "./config.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import cors from "cors";

const app = express();

const allowedOrigins = ['http://localhost:5173/', 'https://proyecto-estructuras-topaz.vercel.app/'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
}));
app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoutes);
app.use("/api/properties", propertyRoutes);

app.get("/", (req, res) => {
  res.send("BIENVENIDO");
});

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
