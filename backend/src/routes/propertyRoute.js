import {Router} from "express";
import {createProperty, getProperty, listProperties} from "../controllers/propertyController.js";
import {requireAuth} from "../middlewares/authMiddleware.js";
import {validatePropertyCreationRequest} from "../middlewares/propertyMiddleware.js";

const router = Router();

router.post("/", requireAuth, validatePropertyCreationRequest, (req, res) => {
  createProperty()(req, res);
});

router.get("/", (req, res) => {
  listProperties()(req, res);
});

router.get("/:id", (req, res) => {
  const {id} = req.params;
  getProperty(id)(req, res);
});

export default router;
