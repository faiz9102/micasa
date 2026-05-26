import AppDataSource from "../configs/data-source.js";
import PropertySchema from "../entities/Property.js";
import { Brackets } from "typeorm";

export const PropertyRepository = AppDataSource.getRepository(PropertySchema).extend({
  async createProperty(propertyData) {
    const property = this.create(propertyData);
    return this.save(property);
  },

  async findById(id) {
    return this.findOne({ where: { id } });
  },

  async findByIdWithOwner(id) {
    return this.findOne({ where: { id }, relations: { owner: true } });
  },

  async updateProperty(id, updateData) {
    const existingProperty = await this.findById(id);
    if (!existingProperty) {
      return null;
    }

    return this.save({
      ...existingProperty,
      ...updateData,
    });
  },

  async deleteProperty(id) {
    const property = await this.findById(id);
    if (!property) {
      return false;
    }

    await this.remove(property);
    return true;
  },

  async findWithFilters(filters = {}, options = {}) {
    const queryBuilder = this.createQueryBuilder("property");

    if (typeof filters.isActive === "boolean") {
      queryBuilder.andWhere("property.isActive = :isActive", { isActive: filters.isActive });
    } else if (options.includeOwnerInactive && options.viewerId) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where("property.isActive = true").orWhere("property.ownerId = :viewerId", {
            viewerId: options.viewerId,
          });
        })
      );
    }

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

    if (filters.ownerId) {
      queryBuilder.andWhere("property.ownerId = :ownerId", { ownerId: filters.ownerId });
    }

    queryBuilder.orderBy("property.createdAt", "DESC");

    return queryBuilder.getMany();
  },
});
