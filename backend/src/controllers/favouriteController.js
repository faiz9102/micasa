import {
  createFavourite,
  getFavouritesByPropertyId,
  getFavouritesByUserId,
  deleteFavourite,
} from "../services/favouriteService.js";

export const createPropertyFavourite = (user, propertyId) => {
  return async (req, res) => {
    const userId = user.id;
    const result = await createFavourite({
      propertyId: propertyId,
      userId: userId,
    });

    if (!result.success && result.code === "NOT_FOUND") {
      return res.status(404).json({ status: "fail", message: result.message });
    }

    if (!result.success && result.code === "DUPLICATE") {
      return res.status(409).json({ status: "fail", message: result.message });
    }

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res
      .status(201)
      .json({ status: "success", favourite: result.favourite });
  };
};

export const listPropertyFavourites = (propertyId) => {
  return async (req, res) => {
    const result = await getFavouritesByPropertyId(propertyId);

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res
      .status(200)
      .json({ status: "success", favourites: result.favourites });
  };
};

export const deletePropertyFavourite = (id, user) => {
  return async (req, res) => {
    const result = await deleteFavourite(id, user);

    if (!result.success && result.code === "NOT_FOUND") {
      return res.status(404).json({ status: "fail", message: result.message });
    }

    if (!result.success && result.code === "NOT_AUTHORIZED") {
      return res.status(403).json({ status: "fail", message: result.message });
    }

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res
      .status(200)
      .json({ status: "success", message: "Favourite deleted successfully" });
  };
};

export const listUserFavourites = (userId) => {
  return async (req, res) => {
    const result = await getFavouritesByUserId(userId);

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res
      .status(200)
      .json({ status: "success", favourites: result.favourites });
  };
};
