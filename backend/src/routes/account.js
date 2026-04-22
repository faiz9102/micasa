import app from "express";
import { getAccount, updateAccount, createAccount } from "../controllers/accountController.js";
import AccountCreationMiddleware from "../middlewares/account.js";

const router = app.Router();

router.post("/",AccountCreationMiddleware, createAccount);
router.get("/", getAccount);
router.put("/", updateAccount);

export default router;