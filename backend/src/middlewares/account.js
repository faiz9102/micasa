import userschema from "@micasa/shared/validations/user.schema.js";
import AppDataSource from "../configs/data-source.js";
import User from "../entities/User.js"

const validateAccountCreationRequest = (req, res, next) => {
  const { name, email, password, type } = req.body;

  const result = userschema.safeParse({ name, email, password, type });

  if (result.success) {
    req.user = result.data;
    next();
  }
  else {
    // TODO : send descriptive error message.
    res.status(400).json({ status: "fail", message: "Invalid form data" });
  }
}

const validateAccountUpdateRequest = (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ status: "fail", message: "Invalid user id" });
  }

  try {
    const user = AppDataSource.getRepository(User).findOneBy({ id });
    if (!user) {
      res.status(404).json({ status: "fail", message: "User not found" });
    }
    req.user = user;
    next();
  }
  catch (e) {
    console.error("Error fetching user:", e?.message);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};

export default validateAccountCreationRequest;