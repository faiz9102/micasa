import app from "express";
import { UserRole } from "../entities/User.js";
import {
  getAccount,
  updateAccount,
  createAccount,
  deactivateAccount,
  deleteAccount
} from "../controllers/accountController.js";
import { promoteAccount } from "../controllers/accountController.js";
import {
  validateUserAccountCreationRequest,
  validateAccountUpdateRequest,
} from "../middlewares/accountMiddleware.js";
import { roleBasedAccessControl } from "../middlewares/authMiddleware.js";

const router = app.Router();

router.post("/", validateUserAccountCreationRequest, (req, res) => {
  createAccount(req.user)(req, res);
});

router.post("/admin", roleBasedAccessControl([UserRole.ADMIN]), validateUserAccountCreationRequest, (req, res) => {
  req.user.role = UserRole.ADMIN; // Ensure role is set to ADMIN for this route
  createAccount(req.user)(req, res);
});

router.get(
  "/",
  (req, res, next) => {
    if (req?.body?.id || req?.params?.id) {
      return getAccount(req?.body?.id ?? req?.params?.id)(req, res);
    }
    next();
  },
  roleBasedAccessControl([UserRole.ADMIN]),
  (req, res) => getAccount()(req, res),
);

router.put("/", validateAccountUpdateRequest, updateAccount);
router.post("/promote", roleBasedAccessControl([UserRole.ADMIN]), (req, res) => {
  promoteAccount()(req, res);
});
router.delete("/:id",roleBasedAccessControl([UserRole.ADMIN]),(req,res) => deactivateAccount(req.params.id)(req,res));
router.delete("/",roleBasedAccessControl([UserRole.USER]), (req, res) => deleteAccount(req.middleware?.user?.id)(req, res));

export default router;
