import express from "express";
import { PORT, ALLOWED_ORIGINS } from "./config.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
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
