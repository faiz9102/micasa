import AppDataSource from "../configs/data-source.js";
import Property from "../entities/Property.js";

export const PropertyRepository = AppDataSource.getRepository(Property).extend({
  async createProperty(propertyData) {
    const property = this.create(propertyData);
    return this.save(property);
  },

  async findById(id) {
    return this.findOne({ where: { id } });
  },

  async findWithFilters(filters = {}) {
    const queryBuilder = this.createQueryBuilder("property");

    if (filters.city) {
      queryBuilder.andWhere("LOWER(property.city) = LOWER(:city)", { city: filters.city });
    }

    if (filters.propertyType) {
      queryBuilder.andWhere("property.propertyType = :propertyType", {
        propertyType: filters.propertyType,
      });
    }

    if (filters.furnishingStatus) {
      queryBuilder.andWhere("property.furnishingStatus = :furnishingStatus", {
        furnishingStatus: filters.furnishingStatus,
      });
    }

    if (typeof filters.bedrooms !== "undefined") {
      queryBuilder.andWhere("property.bedrooms = :bedrooms", { bedrooms: filters.bedrooms });
    }

    if (typeof filters.minPrice !== "undefined") {
      queryBuilder.andWhere("property.price >= :minPrice", { minPrice: filters.minPrice });
    }

    if (typeof filters.maxPrice !== "undefined") {
      queryBuilder.andWhere("property.price <= :maxPrice", { maxPrice: filters.maxPrice });
    }

    queryBuilder.orderBy("property.createdAt", "DESC");

    return queryBuilder.getMany();
  },
});
