import AppDataSource from "../configs/data-source.js";
import FavouriteSchema from "../entities/Favourites.js";

export const FavouriteRepository = AppDataSource.getRepository(FavouriteSchema).extend({
  async createFavourite(propertyId, userId) {
    const favourite = this.create({ userId, propertyId });
    return this.save(favourite);
  },

  async findById(id) {
    return this.findOne({ where: { id } });
  },

  async findByPropertyAndUser(propertyId, userId) {
    return this.findOne({ where: { propertyId, userId } });
  },

  async findByPropertyId(propertyId) {
    return this.find({ where: { propertyId } });
  },

  async findByUserId(userId) {
    return this.find({ where: { userId } });
  },

  async saveFavourite(favourite) {
    return this.save(favourite);
  },
});
