import { Router } from "express";
import { createProperty, deleteProperty, getProperty, listProperties, updateProperty } from "../controllers/propertyController.js";
import { requireAuth, requireSellerAccess } from "../middlewares/authMiddleware.js";
import { requirePropertyOwnerOrAdmin, validatePropertyCreationRequest, validatePropertyUpdateRequest } from "../middlewares/propertyMiddleware.js";
import inquiryRoutes from "./inquiryRoute.js";

const router = Router();

router.post("/", requireAuth, requireSellerAccess, validatePropertyCreationRequest, (req, res) => {
  createProperty()(req, res);
});

router.get("/", (req, res) => {
  listProperties()(req, res);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  getProperty(id)(req, res);
});

router.patch("/:id", requireAuth, requireSellerAccess, requirePropertyOwnerOrAdmin, validatePropertyUpdateRequest, (req, res) => {
  const { id } = req.params;
  updateProperty(id)(req, res);
});

router.delete("/:id", requireAuth, requireSellerAccess, requirePropertyOwnerOrAdmin, (req, res) => {
  const { id } = req.params;
  deleteProperty(id)(req, res);
});

router.use("/:id/inquiries", inquiryRoutes);

export default router;
