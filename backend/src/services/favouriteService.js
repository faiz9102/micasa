import { FavouriteRepository } from "../repositories/favouriteRepository.js";
import { PropertyRepository } from "../repositories/propertyRepository.js";
import { UserRepository } from "../repositories/userRepository.js";

const buildFavouriteResponse = (favourite, user, property) => ({
  ...favourite,
  user: user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }
    : undefined,
  property: property
    ? {
        id: property.id,
        title: property.title,
        description: property.description,
      }
    : undefined,
});

export const createFavourite = async ({ propertyId, userId }) => {
  try {
    const property = await PropertyRepository.findById(propertyId);

    if (!property) {
      return {
        success: false,
        message: "Property not found",
        code: "NOT_FOUND",
      };
    }

    if (!property.isActive) {
      return {
        success: false,
        message: "Property not found",
        code: "NOT_FOUND",
      };
    }

    const existingFavourite = await FavouriteRepository.findByPropertyAndUser(
      propertyId,
      userId,
    );
    if (existingFavourite) {
      return {
        success: false,
        message: "Favourite already exists",
        code: "DUPLICATE",
      };
    }

    const favourite = await FavouriteRepository.createFavourite(
      propertyId,
      userId,
    );

    return {
      success: true,
      favourite: buildFavouriteResponse(favourite, user, property),
    };
  } catch (error) {
    console.error("Error creating favourite:", error);
    return {
      success: false,
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    };
  }
};

export const getFavouritesByUserId = async (userId) => {
  try {
    const favourites = await FavouriteRepository.findByUserId(userId);

    // return active properties only
    const activeFavourites = [];
    for (const favourite of favourites) {
      const property = await PropertyRepository.findById(favourite.propertyId);
      if (property && property.isActive) {
        activeFavourites.push(favourite);
      }
    }
    const favouriteResponses = await Promise.all(
      activeFavourites.map(async (favourite) => {
        const property = await PropertyRepository.findById(
          favourite.propertyId,
        );
        const user = await UserRepository.findById(favourite.userId);
        return buildFavouriteResponse(favourite, user, property);
      }),
    );

    return {
      success: true,
      favourites: favouriteResponses,
    };
  } catch (error) {
    console.error("Error fetching favourites:", error);
    return {
      success: false,
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    };
  }
};

export const deleteFavourite = async (favouriteId, user) => {
  try {
    const favourite = await FavouriteRepository.findById(favouriteId);

    if (!favourite) {
      return {
        success: false,
        message: "Favourite not found",
        code: "NOT_FOUND",
      };
    }

    if (favourite.userId !== user.id && user.role !== "admin") {
      return {
        success: false,
        message: "Not Authorized.",
        code: "NOT_AUTHORIZED",
      };
    }

    await FavouriteRepository.remove(favourite);

    return {
      success: true,
      message: "Favourite deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting favourite:", error);
    return {
      success: false,
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    };
  }
};

export const getFavouritesByPropertyId = async (propertyId) => {
  try {
    const favourites = await FavouriteRepository.findByPropertyId(propertyId);

    const favouriteResponses = await Promise.all(
      favourites.map(async (favourite) => {
        const property = await PropertyRepository.findById(
          favourite.propertyId,
        );
        const user = await UserRepository.findById(favourite.userId);
        return buildFavouriteResponse(favourite, user, property);
      }),
    );

    return {
      success: true,
      favourites: favouriteResponses,
    };
  } catch (error) {
    console.error("Error fetching favourites:", error);
    return {
      success: false,
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    };
  }
};
