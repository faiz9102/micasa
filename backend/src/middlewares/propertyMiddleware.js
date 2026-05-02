import propertySchema from "@micasa/shared/validations/property.schema.js";

export const validatePropertyCreationRequest = (req, res, next) => {
  const result = propertySchema.safeParse(req.body);

  if (result.success) {
    req.property = result.data;
    return next();
  }

  return res.status(400).json({
    status: "fail",
    message: "Invalid property data",
    errors: result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
};
