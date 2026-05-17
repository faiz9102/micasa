import propertySchema from "@micasa/shared/validations/property.schema.js";
import { getPropertyById } from "../services/propertyService.js";

export const validatePropertyCreationRequest = (req, res, next) => {
  const result = propertySchema.safeParse(req.body);

  if (result.success) {
    req.property = {
      ...result.data,
      isActive: false,
    };
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

export const requirePropertyOwnerOrAdmin = async (req, res, next) => {
  const user = req?.middleware?.user;

  if (!user?.id) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  if (user.role === "admin") {
    return next();
  }

  if (user.loggedInAsSeller !== true) {
    return res.status(403).json({ status: "fail", message: "Forbidden" });
  }

  const propertyId = req?.params?.id;
  const propertyResult = await getPropertyById(propertyId);

  if (!propertyResult.success && propertyResult.code === "NOT_FOUND") {
    return res.status(404).json({ status: "fail", message: propertyResult.message });
  }

  if (!propertyResult.success) {
    return res.status(500).json({ status: "fail", message: propertyResult.message });
  }

  if (propertyResult.property.ownerId !== user.id) {
    return res.status(403).json({ status: "fail", message: "Forbidden" });
  }

  return next();
};

export const validatePropertyUpdateRequest = async (req, res, next) => {
  const user = req?.middleware?.user;
  const propertyId = req?.params?.id;
  const propertyResult = await getPropertyById(propertyId);

  if (!propertyResult.success && propertyResult.code === "NOT_FOUND") {
    return res.status(404).json({ status: "fail", message: propertyResult.message });
  }

  if (!propertyResult.success) {
    return res.status(500).json({ status: "fail", message: propertyResult.message });
  }

  if (typeof req.body.isActive !== "undefined" && user?.role !== "admin") {
    return res.status(403).json({ status: "fail", message: "Forbidden" });
  }

  const existingProperty = propertyResult.property;
  const baseData = {
    propertyType: existingProperty.propertyType,
    purpose: existingProperty.purpose,
    city: existingProperty.city,
    area: existingProperty.area,
    price: existingProperty.price,
    description: existingProperty.description,
    imageUrls: existingProperty.imageUrls,
    amenities: existingProperty.amenities ?? undefined,
    bedrooms: existingProperty.bedrooms ?? undefined,
    furnishingStatus: existingProperty.furnishingStatus ?? undefined,
    rentalScope: existingProperty.rentalScope ?? undefined,
    floorNumber: existingProperty.floorNumber ?? undefined,
    isActive: existingProperty.isActive,
  };

  const result = propertySchema.safeParse({
    ...baseData,
    ...req.body,
  });

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
