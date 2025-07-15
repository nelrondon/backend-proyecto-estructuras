import { Router } from "express";
import { PropertyController } from "../controllers/property.controller.js";

import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.get("/", PropertyController.get);
router.get("/:id", PropertyController.getByID);
router.get("/type/:type", PropertyController.getByType);
router.get("/status/:status", PropertyController.getByStatus);

router.put("/", authRequired, PropertyController.modify);
router.post("/", authRequired, PropertyController.register);
router.delete("/", authRequired, PropertyController.delete);

export default router;
