import { PropertyRepository } from "../repositories/propertyRepository.js";

export const registerProperty = async (ownerId, propertyData) => {
  try {
    const createdProperty = await PropertyRepository.createProperty({
      ...propertyData,
      ownerId,
    });

    return { success: true, property: createdProperty };
  } catch (error) {
    console.error("Error creating property:", error);
    return { success: false, message: "Internal server error" };
  }
};

export const getPropertyById = async (id) => {
  try {
    const property = await PropertyRepository.findById(id);

    if (!property) {
      return { success: false, message: "Property not found", code: "NOT_FOUND" };
    }

    return { success: true, property };
  } catch (error) {
    console.error("Error fetching property by id:", error);
    return { success: false, message: "Internal server error", code: "INTERNAL_ERROR" };
  }
};

export const getProperties = async (filters = {}) => {
  try {
    const properties = await PropertyRepository.findWithFilters(filters);
    return { success: true, properties };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return { success: false, message: "Internal server error", code: "INTERNAL_ERROR" };
  }
};

export const updatePropertyById = async (id, updateData) => {
  try {
    const updatedProperty = await PropertyRepository.updateProperty(id, updateData);

    if (!updatedProperty) {
      return { success: false, message: "Property not found", code: "NOT_FOUND" };
    }

    return { success: true, property: updatedProperty };
  } catch (error) {
    console.error("Error updating property:", error);
    return { success: false, message: "Internal server error", code: "INTERNAL_ERROR" };
  }
};

export const deletePropertyById = async (id) => {
  try {
    const deleted = await PropertyRepository.deleteProperty(id);

    if (!deleted) {
      return { success: false, message: "Property not found", code: "NOT_FOUND" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting property:", error);
    return { success: false, message: "Internal server error", code: "INTERNAL_ERROR" };
  }
};
