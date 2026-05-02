import { deletePropertyById, getProperties, getPropertyById, registerProperty, updatePropertyById } from "../services/propertyService.js";

export const createProperty = () => {
  return async (req, res) => {
    const ownerId = req?.middleware?.user?.id;

    if (!ownerId) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    const result = await registerProperty(ownerId, req.property);

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res.status(201).json({ status: "success", property: result.property });
  };
};

export const listProperties = () => {
  return async (req, res) => {
    const {
      city,
      minPrice,
      maxPrice,
      bedrooms,
      propertyType,
      furnishingStatus,
    } = req.query;

    const filters = {
      ...(city ? { city } : {}),
      ...(propertyType ? { propertyType } : {}),
      ...(furnishingStatus ? { furnishingStatus } : {}),
      ...(typeof bedrooms !== "undefined" ? { bedrooms: Number(bedrooms) } : {}),
      ...(typeof minPrice !== "undefined" ? { minPrice: Number(minPrice) } : {}),
      ...(typeof maxPrice !== "undefined" ? { maxPrice: Number(maxPrice) } : {}),
    };

    const result = await getProperties(filters);

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res.status(200).json({ status: "success", properties: result.properties });
  };
};

export const getProperty = (id) => {
  return async (req, res) => {
    const result = await getPropertyById(id);

    if (!result.success && result.code === "NOT_FOUND") {
      return res.status(404).json({ status: "fail", message: result.message });
    }

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res.status(200).json({ status: "success", property: result.property });
  };
};

export const updateProperty = (id) => {
  return async (req, res) => {
    const result = await updatePropertyById(id, req.property);

    if (!result.success && result.code === "NOT_FOUND") {
      return res.status(404).json({ status: "fail", message: result.message });
    }

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res.status(200).json({ status: "success", property: result.property });
  };
};

export const deleteProperty = (id) => {
  return async (req, res) => {
    const result = await deletePropertyById(id);

    if (!result.success && result.code === "NOT_FOUND") {
      return res.status(404).json({ status: "fail", message: result.message });
    }

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res.status(200).json({ status: "success", message: "Property deleted" });
  };
};
