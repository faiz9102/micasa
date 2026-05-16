import { Router } from "express";
import {
  createPropertyFavourite,
  deletePropertyFavourite,
  listPropertyFavourites,
  listUserFavourites,
} from "../controllers/favouriteController.js";
import {
  requireAuth,
  roleBasedAccessControl,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/property/:propertyId", requireAuth, (req, res) =>
  createPropertyFavourite(req.middleware.user, req.params.propertyId)(
    req,
    res,
  ),
);

router.delete("/:id", requireAuth, (req, res) =>
  deletePropertyFavourite(req.params.id, req.middleware.user)(req, res),
);

router.get(
  "/property/:propertyId",
  roleBasedAccessControl(["admin"]),
  (req, res) => listPropertyFavourites(req.params.propertyId)(req, res),
);

router.get(
  "/user/:userId",
  requireAuth,
  roleBasedAccessControl(["admin"]),
  (req, res) => listUserFavourites(req.params.userId)(req, res),
);

router.get("/", requireAuth, (req, res) =>
  listUserFavourites(req.middleware.user.id)(req, res),
);

export default router;
